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
    constructor(kp, ki, kd, dt, outMin, outMax) {
        this.kp = kp
        this.ki = ki
        this.kd = kd
        this.dt = dt
        this.outMin = outMin
        this.outMax = outMax

        this.ITerm = 0
        this.inPrev = 0

        this.isRunning = true
    }

    compute(input, setPt) {
        if (this.isRunning) {
            let err = setPt - input
            this.ITerm += this.ki * err
            this.ITerm = clamp(this.ITerm, this.outMin, this.outMax)

            let dInput = input - this.inPrev
            this.inPrev = input

            let output = this.kp * err + this.ITerm * dt - this.kd * dInput * dt
            output = clamp(output, this.outMin, this.outMax)

            return output
        }
        return this.inPrev
    }

    setMode(isRunning) {
        this.isRunning = isRunning
    }

    setTuning(kp, ki, kd) {
        this.kp = kp
        this.ki = ki * this.dt
        this.kd = kd / this.dt
    }
}
