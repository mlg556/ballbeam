// Derivative on Measurement - to prevent the abrupt changes in setpoint causing BIG dErrs. ?????
// Reset Windup, for limiting integral term and output.

// see http://brettbeauregard.com/blog/2011/04/improving-the-beginners-pid-introduction/

function clamp(x, a, b) {
    if (x < a) {
        return a
    } else if (x > b) {
        return b
    }

    return x
}

class PIDController {
    constructor(kp, ki, kd, dt) {
        this.kp = kp
        this.ki = ki
        this.kd = kd
        this.dt = dt

        this.last_err = 0 // last error, used to calculate dErr
        this.i_err = 0 // integral of error
    }

    compute(input, setPt) {
        let err = setPt - input

        this.i_err += err * this.dt // integral of error sum

        let dErr = (err - this.last_err) * this.dt

        let output = this.kp * err + this.ki * this.i_err + this.kd * dErr

        console.log(
            `out = ${output}, (${this.kp * err} + ${this.ki * this.i_err} + ${
                this.kd * dErr
            })`
            // this.ITerm
        )

        return output
    }

    reset() {
        this.ITerm = 0
        this.inPrev = 0
    }
}
