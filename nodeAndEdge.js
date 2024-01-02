class Node {
    constructor(id, position, radius, hex) {
        this.id = id
        this.position = position
        this.radius = radius
        this.neighbourNodes = []
        this.inMST = false
        this.hex = hex
    }

    connectNode(otherNode) {
        if (!this.checkIfConnected(otherNode)) {
            this.neighbourNodes.push(otherNode)
            otherNode.neighbourNodes.push(this)
        }
    }

    removeNode() {

    }

    checkIfConnected(otherNode) {
        for (let n of this.neighbourNodes) {
            if (
                n.id == otherNode.id
            ) {
                return true
            }
        }
        return false
    }

    display() {
        ellipse(this.position.x, this.position.y, this.radius)
        for (let n of this.neighbourNodes) {
            line(
                this.position.x, this.position.y,
                n.position.x, n.position.y
            )
        }
    }
}


class Edge {
    constructor(n1, n2, weight, primaryColor, secondaryColor) {
        this.n1 = n1
        this.n2 = n2
        this.weight = weight

        this.primaryColor = primaryColor
        this.secondaryColor = secondaryColor
    }

    display() {
        ctx.strokeStyle = 'black'
        ctx.lineWidth = 8
        drawLine(this.n1.position.x, this.n1.position.y, this.n2.position.x, this.n2.position.y)
        
    
        ctx.beginPath();
        ctx.ellipse(this.n1.position.x, this.n1.position.y, 5, 5, Math.PI / 4, 0, 2 * Math.PI);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.ellipse(this.n2.position.x, this.n2.position.y, 5, 5, Math.PI / 4, 0, 2 * Math.PI);
        ctx.stroke();

        // ctx.strokeStyle = palette[Math.floor($fx.rand()*palette.length)]
        // for (let n = 0; n < 30; n++) {
        //     drawLine(this.n1.position.x+15, this.n1.position.y+15, this.n2.position.x+15, this.n2.position.y+15)
        // }

    }
}