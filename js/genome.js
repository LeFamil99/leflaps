

class Matrix {
    constructor(rows, cols, value = []) {
        this._rows = rows;
        this._cols = cols;
        this._value = value;

        if (value.length === 0) {
            for (let i = 0; i < rows; i++) {
                this._value.push([])
                for (let j = 0; j < cols; j++) {
                    this._value[i].push(0)
                }
            }
        }
    }

    get rows() {
        return this._rows;
    }

    get cols() {
        return this._cols;
    }

    get value() {
        return this._value;
    }

    set value(x) {
        this._value = x;
    }

    generateWeights() {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++)
                this.value[i][j] = Math.random() * 2 - 1
        }
    }

    static sum(m1, m2) {
        let m = new Matrix(m1.rows, m1.cols)
        for (let i = 0; i < m1.rows; i++)
            for (let j = 0; j < m1.cols; j++)
                m.value[i][j] = m1.value[i][j] + m2.value[i][j]
        return m
    }

    static dif(m1, m2) {
        let m = new Matrix(m1.rows, m1.cols)
        for (let i = 0; i < m1.rows; i++)
            for (let j = 0; j < m1.cols; j++)
                m.value[i][j] = m1.value[i][j] - m2.value[i][j]
        return m
    }

    static mult(m1, m2) {
        let m = new Matrix(m1.rows, m1.cols)
        for (let i = 0; i < m1.rows; i++)
            for (let j = 0; j < m1.cols; j++)
                m.value[i][j] = m1.value[i][j] * m2.value[i][j]
        return m
    }

    static dProd(m1, m2) {
        let m = new Matrix(m1.rows, m2.cols)
        for (let i = 0; i < m2.cols; i++) {
            for (let j = 0; j < m1.rows; j++) {
                let sum = 0;
                for (let k = 0; k < m1.cols; k++) {
                    //console.log(i, j, k)
                    sum += m1.value[j][k] * m2.value[k][i]
                }
                m.value[j][i] = sum;
            }
        }
        return m
    }

    static map(m1, func) {
        let m = new Matrix(m1.rows, m1.cols)
        for (let i = 0; i < m1.rows; i++)
            for (let j = 0; j < m1.cols; j++)
                m.value[i][j] = func(m1.value[i][j])
        return m
    }

    static mutate(m1, n) {
        let m = new Matrix(m1.rows, m1.cols)
        for (let i = 0; i < m1.rows; i++)
            for (let j = 0; j < m1.cols; j++)
                if (Math.random() > 0.5) {
                    m.value[i][j] = m1.value[i][j] + (Math.random() - 0.5) * n / 4
                } else m.value[i][j] = m1.value[i][j] 
        return m
    }

    static clone(m1) {
        let m = new Matrix(m1.rows, m1.cols)
        for (let i = 0; i < m1.rows; i++)
            for (let j = 0; j < m1.cols; j++)
                m.value[i][j] = m1.value[i][j];
    }

    static inv(m1) {
        let m = new Matrix(m1.cols, m1.rows)
        for (let i = 0; i < m.rows; i++) {
            for (let j = 0; j < m.cols; j++) {
                m.value[i][j] = m1.value[j][i]
            }
        }
        return m
    }


}

//----------------------------------------------------------------------------------

class Genome {
    constructor(inputs, outputs, weights = []) {
        this.inputs = inputs;
        this.outputs = outputs;
        if (weights.length !== 0)
            this.weights = new Matrix(inputs + 1, outputs, weights)
        else {
            this.weights = new Matrix(inputs + 1, outputs)
            this.weights.generateWeights();
        }  
    }



    clone() {
        return new Genome(this.inputs, this.outputs, this.weights)
    }

    feedForward(inputArr) {
        inputArr.push(1)
        //console.log(new Matrix(1, inputArr.length, [inputArr]), this.weights)
        let N = Matrix.dProd(new Matrix(1, inputArr.length, [inputArr]), this.weights)
        return Matrix.map(N, x => x < 0? 0: 1)
    }

    mutate(n) {
        this.weights = Matrix.mutate(this.weights, n)
    }

    /*mutate() {

        if (Math.random() > 0.5) {
            console.log('Yes')
            Matrix.map(this.weights, x => x + (Math.random() - 0.5) / 5)
        }
        
    }*/
}



/*Z = new Genome(3, 3, new Matrix(3, 4, [[1, 1, 1, 1], [2, 2, 2, 2], [3, 3, 3, 3]]))
console.log(Z)
Z.weights = Matrix.mutate(Z.weights)
console.log(Z)
Z.weights = Matrix.mutate(Z.weights)
console.log(Z)
Z.weights = Matrix.mutate(Z.weights)
console.log(Z)*/

