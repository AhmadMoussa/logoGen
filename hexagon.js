
function makeHex(X, Y, col, row, origx, origy, size){
    this.coord = {x: X, y: Y}
    this.col = col 
    this.row = row
    this.size = size

    this.origx = origx 
    this.origy = origy

    this.hexNode = new Node(nodeCounter++, this.coord, 10, this)

    this.offSetSpin = 0 //random([0, TAU/6])

    this.connected = false

    this.vertices = []
    this.vertices2 = []
    this.makeVertices = function(){
        let randShrink = $fx.rand()*4+1
        for(let a = this.offSetSpin; a < TAU+this.offSetSpin-.01; a+=TAU/6){
            this.vertices.push({x: this.coord.x + this.size * Math.cos(a), y: this.coord.y + this.size * Math.sin(a)})
            this.vertices2.push({x: this.coord.x + this.size/randShrink * Math.cos(a), y: this.coord.y + this.size/randShrink * Math.sin(a)})
        }
    }
    this.makeVertices()

    this.neighbours = []

    this.display = function(col1, col2, mini){

        ctx.beginPath()
        ctx.moveTo(this.vertices2[0].x, this.vertices[0].y)
        for(let n = 0; n < this.vertices.length; n++){
            let v = this.vertices2[n]
            ctx.lineTo(v.x,v.y)
        }
        ctx.fillStyle = palette[Math.floor($fx.rand() * palette.length)] + '01'
        ctx.fill()

        let mod = 1
        if(mini){
            mod = 2
        }
    
        for(let n = 0; n < this.vertices.length; n++){
            let v = this.vertices2[n]
            let vn = this.vertices2[(n+1)%this.vertices.length]

            for(let n = 0; n < 60; n++){
                ctx.beginPath()
                ctx.moveTo(v.x + getR(o)/mod, v.y + getR(o)/mod)
                ctx.lineTo(vn.x + getR(o)/mod, vn.y + getR(o)/mod)

                ctx.lineWidth = $fx.rand() * maxStrokeWeight
                ctx.stroke()
           }
        }
    }
}

