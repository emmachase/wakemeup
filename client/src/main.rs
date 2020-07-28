use std::panic;
use rust_pigpio::{self as pigpio, pwm::*, OUTPUT, OFF};
use ws;

const PIEZO_PIN: u32 = 23;
const ONE_SECOND: u32 = 1000000;
fn run() -> Result<(), String> {
    pigpio::set_mode(PIEZO_PIN, OUTPUT)?;

    set_pwm_frequency(PIEZO_PIN, 500).unwrap();
    set_pwm_range(PIEZO_PIN, 1000).unwrap();

    loop {
        match ws::connect("wss://wakemeup.its-em.ma/poll", |_sender| {
            move |msg: ws::Message| {
                let msg = msg.as_text()?;

                let len: u32 = match msg.parse() {
                    Ok(x) => x,
                    Err(..) => {
                        eprintln!("Invalid len: {}", msg);
                        return Ok(())
                    }
                };

                let len = std::cmp::min(len, 10);
                for _ in 0..len*5 {
                    pwm(PIEZO_PIN, 500).unwrap();
                    pigpio::delay(ONE_SECOND / 5);
                    pigpio::write(PIEZO_PIN, OFF).unwrap();
                    pigpio::delay(ONE_SECOND / 5 / 10);
                }

                Ok(())
            }
        }) {
            Ok(()) => (),
            Err(e) => eprintln!("WS Error: {}", e)
        }
    }
}

fn main() -> Result<(), String> {
    pigpio::initialize()?;

    panic::catch_unwind(|| match run() {
        Ok(()) => (),
        Err(e) => eprintln!("{}", e)
    }).ok();
    pigpio::terminate();

    Ok(())
}
