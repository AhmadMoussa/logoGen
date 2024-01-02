class Region {
  constructor(node, noLim, size) {
    this.startNode = node
    this.queue = new MinPriorityQueue()
    this.spanLength = Math.round($fx.rand() * 15 + 5)

    if (noLim) {
      this.spanLength = 9999
    }

    this.nodes = []
    this.edges = []

    this.nodeVerts = []
    this.filteredVerts = []
    this.sortedVerts = []

    this.contourVerts = []
    this.embellishmentEdges1 = []
    this.embellishmentEdges2 = []

    this.size = size

    this.primaryColor = palette[Math.floor($fx.rand() * palette.length)]
    this.secondaryColor = palette[Math.floor($fx.rand() * palette.length)]
  }

  primExpansion() {
    this.nodes.push(this.startNode)

    for (let n = 0; n < this.startNode.neighbourNodes.length; n++) {
      this.queue.insert([this.startNode, this.startNode.neighbourNodes[n]], 1)
    }

    let curr = this.startNode
    this.startNode.inMST = true

    while (this.nodes.length < this.spanLength) {
      let next = this.queue.extractMin()

      if (next == null) {
        break
      }

      // let alreadyInMST = false
      // for(let n of this.nodes){
      //     if(next[1].id == n.id || !next[1].inMST){
      //         alreadyInMST = true
      //     }
      // }

      if (next[1] != null && !next[1].inMST) {
        this.nodes.push(next[1])
        next[1].inMST = true

        for (let n = 0; n < next[1].neighbourNodes.length; n++) {
          this.queue.insert([next[1], next[1].neighbourNodes[n]], 1)
        }

        this.edges.push(
          new Edge(next[0], next[1], 1, this.primaryColor, this.secondaryColor)
        )
        curr = next[1]
      }
    }
  }

  createContourPolygon() {

    // collects all vertices of all hexagons in the region
    for (let n of this.nodes) {
      for (let v of n.hex.vertices) {
        let nodeVert = { v: v, node: n }
        this.nodeVerts.push(nodeVert)
      }
    }

    // discards internal vertices (vertices connected to 3 hexagons)
    this.filteredVerts = removeInternalVertices(this.nodeVerts, 2)

    // removes duplicate vertices (vertices connected to 2 hexagons) keeps one
    this.filteredVerts = removeDuplicates(this.filteredVerts, 2)

    let ret = constructSortedList(this.filteredVerts, this.edges, this.nodes, this.primaryColor, this.secondaryColor, this.size)
    if (ret == undefined) { return 0 }
    this.contourVertices = ret[0]
    this.embellishmentEdges1 = ret[1]
    this.embellishmentEdges2 = ret[2]

  }

  display() {
    let togg = true
    if ($fx.rand() > 0) {
      for (let e of this.edges) {
        e.display(this.mini)
      }
      togg = false
    }

    if (togg || $fx.rand() > .75) {
      for (let n of this.nodes) {
        //n.hex.display(this.primaryColor, this.secondaryColor, this.mini)
      }
    }
  }

  displayContour() {
    console.log('here')
    console.log(this.contourVertices)
    if (!this.contourVertices) {
      console.log('abort')
      return 0
    }

    console.log('next')
    ctx.beginPath()
    ctx.moveTo(this.contourVertices[0].x,this.contourVertices[0].y)
    for(let n = 0; n < this.contourVertices.length; n++){
      let v = this.contourVertices[n]
      let vn = this.contourVertices[(n+1)%this.contourVertices.length]
      
      
      ctx.lineTo(vn.x,vn.y)
      
    }
    if($fx.rand()>.25){
      ctx.fillStyle = this.secondaryColor
      ctx.fill()
  
      
    }
    ctx.strokeStyle = 'black'
      ctx.stroke()
    

    for(let n = 0; n < this.contourVertices.length; n++){
      let v = this.contourVertices[n]

      
      ctx.beginPath();
        ctx.ellipse(v.x, v.y, 5, 5, Math.PI / 4, 0, 2 * Math.PI);
        ctx.stroke();
      
    }
  }
}




let shapeCounter = 0
function constructSortedList(coordinates, edges, nodes, col1, col2, size) {
  let modifiable = [...coordinates]

  let embellishmentEdges1 = []
  let embellishmentEdges2 = []
  let shapeNodes = []
  for (let i = 0; i < modifiable.length; i++) {
    shapeNodes.push(new Node(shapeCounter + '' + i, modifiable[i].v, size, modifiable[i].node.hex))
  }
  shapeCounter++

  let result = findMinMaxCoordinates(modifiable);
  if($fx.rand()>.75){
    col1 = palette[Math.floor($fx.rand() * palette.length)]
  }
  
  col2 = palette[Math.floor($fx.rand() * palette.length)]
  //ctx.strokeStyle = col

  
  rmaxStrokeWeight = maxStrokeWeight //+ getR(.25)
  for (let i = 0; i < modifiable.length; i++) {
    let v = modifiable[i]
    let closebys = []

    for (let j = 0; j < modifiable.length; j++) {
      if (j == i) {
        continue
      }

      let otherV = modifiable[j]

      let d = distance(v.v.x, v.v.y, otherV.v.x, otherV.v.y)

      if (d < size / 1.75) {
        closebys.push(
          { v: otherV, j: j }
        )
      }
    }

    for (let k = 0; k < closebys.length; k++) {
      let vc = closebys[k].v
      for (let q = 0; q < edges.length; q++) {

        let e = edges[q]

        let intersection = intersect(
          v.v.x, v.v.y, vc.v.x, vc.v.y,
          e.n1.position.x, e.n1.position.y, e.n2.position.x, e.n2.position.y
        )

        if (intersection != false) {
          closebys.splice(k, 1)
          k--
          break
        }
      }
    }

    for (let k = 0; k < closebys.length; k++) {
      if (closebys.length >= 3) {
        if (distance(closebys[k].v.node.position.x, closebys[k].v.node.position.y,
          v.node.position.x, v.node.position.y) > size * 1.25) {
          closebys.splice(k, 1)
          k--
        }
      }
    }

    for (let k = 0; k < closebys.length; k++) {
      if (closebys.length >= 3) {
        let vc = closebys[k]

        let intersection = intersect(
          v.v.x, v.v.y, vc.v.x, vc.v.y,
          v.node.position.x, v.node.position.y, vc.v.node.position.x, vc.v.node.position.y
        )

        if (intersection != false) {
          closebys.splice(k, 1)
          k--
          break
        }
      }
    }

    let mapped = mapRange(v.v.y, result.min.y, result.max.y, 0, 1)
    let col = col1 //interpolateHexColors(col1, col2, mapped)

    ctx.strokeStyle = 'black'

    for (let k = 0; k < closebys.length; k++) {
        ctx.lineWidth = 8

        drawLine(v.v.x + getR(o), v.v.y + getR(o), closebys[k].v.v.x + getR(o), closebys[k].v.v.y + getR(o))

        ctx.beginPath();
        ctx.ellipse(v.v.x, v.v.y, 5, 5, Math.PI / 4, 0, 2 * Math.PI);
        ctx.stroke();

      let ne = { x1: v.v.x, y1: v.v.y, x2: closebys[k].v.v.x, y2: closebys[k].v.v.y }
      embellishmentEdges1.push(ne)
      shapeNodes[i].connectNode(shapeNodes[closebys[k].j])

      let ne2 = { x1: v.v.x, y1: v.v.y, x2: v.node.position.x, y2: v.node.position.y }
      embellishmentEdges2.push(ne2)

      ctx.lineWidth = 8
      //drawLine(v.v.x + getR(o), v.v.y + getR(o), v.node.position.x + getR(o), v.node.position.y + getR(o))
      
    }

  }

  let isContourable = true
  for (let s of shapeNodes) {
    if (s.neighbourNodes.length != 2) {
      isContourable = false
    }
  }


  if (isContourable) {
    return [connectContour([...shapeNodes]), embellishmentEdges1, embellishmentEdges2]
  }
}



function connectContour(nodes) {
  let contourVerts = []
  let contourNodes = []
  let startNode = nodes[Math.floor($fx.rand() * nodes.length)]

  let curr = startNode
  curr.visited = true
  contourNodes.push(curr)
  let next = curr.neighbourNodes[Math.floor($fx.rand() * curr.neighbourNodes.length)]

  while (!next.visited) {
    contourVerts.push(curr.position)

    curr = next
    curr.visited = true
    contourNodes.push(curr)

    for (let n of curr.neighbourNodes) {
      next = n
      if (!next.visited) {
        break
      }
    }
  }
  contourVerts.push(curr.position)


  return contourVerts
}