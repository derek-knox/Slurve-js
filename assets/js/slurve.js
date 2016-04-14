/*
 * Slurve | slurve.js: Beautiful Slants and Curves in Web UIs
 * MIT license https://opensource.org/licenses/MIT
 * Copyright (c) 2016 Derek Knox | Braindrop Labs
 * Version: 1.0
 * @author Derek Knox http://derekknox.com @derekknox
 */

;(function() {
  
  /******************************************************************
  API
  ******************************************************************/
  
  this.slurve = {
    update: update
  };
  
  /******************************************************************
  Init
  ******************************************************************/  

  //cache
  var $slurves;

  //listeners
  this.addEventListener('resize', updateSlurves);
  
  //init
  window.onload = function() { update(); }
  update();
  
  /******************************************************************
  Methods
  ******************************************************************/

  function extractPoints($el) {
    var pointValues = $el.attributes['data-slurve'].value.split(' '),
        point,
        points = [];

    for(var i = 0, len = pointValues.length; i < len; i++) {
      point = pointValues[i].split(',');
      points.push({ 'x': +point[0], 'y': +point[1], 'r': +point[2] || 0 });
    }

    return points;
  }

  function getWidth(width, extractedPoints) {
    var totalWidth = 0;

    for(var i = 0, len = extractedPoints.length; i < len; i++) {
      totalWidth += Math.abs(extractedPoints[i].x);
    }

    return totalWidth + width;
  }

  function getHeight(height, extractedPoints) {
    var totalHeight = 0;

    for(var i = 0, len = extractedPoints.length; i < len; i++) {
      totalHeight += Math.abs(extractedPoints[i].y);
    }

    return totalHeight + height;
  }

  function getViewBox(extractedPoints, width, height) {
    var x = Math.min.apply(Math, extractedPoints.map( function(o) { return o.x; } )),
        y = Math.min.apply(Math, extractedPoints.map( function(o) { return o.y; } )),
        w = width,
        h = height;
    return { 'x': x, 'y': y, 'w': w, 'h': h, 'rect': x + ' ' + y + ' ' + w + ' ' + h };
  }

  function trace(extractedPoints, bounds) {
    var a = extractedPoints[0],
        b = extractedPoints[1],
        c = extractedPoints[2],
        d = extractedPoints[3],
        points = 'M';

    points += a.x + ',' + (a.y + a.r) + ' Q';
    points += a.x + ',' + a.y + ' ';
    points += (a.x + a.r) + ',' + a.y + ' L';
    points += (bounds.width + b.x - b.r) + ',' + (b.y) + ' Q';
    points += (bounds.width + b.x) + ',' + b.y + ' ';
    points += (bounds.width + b.x) + ',' + (b.y + b.r) + ' L';
    points += (bounds.width + c.x) + ',' + (bounds.height + c.y - c.r) + ' Q';
    points += (bounds.width + c.x) + ',' + (bounds.height + c.y) + ' ';
    points += (bounds.width + c.x - c.r) + ',' + (bounds.height + c.y) + ' L';
    points += (d.x + d.r) + ',' + (bounds.height + d.y) + ' Q';
    points += d.x + ',' + (bounds.height + d.y) + ' ';
    points += d.x + ',' + (bounds.height + d.y - d.r);

    return points;
  }

  //clear
  function clear($el) {
    var $svg = $el.getElementsByClassName('slurve-svg')[0];
    if($svg) {
      $svg.parentNode.removeChild($svg);
    }
  }

  //update individual slurve
  function updateSlurve($el) {

    //helpers
    var extractedPoints = extractPoints($el),
        bounds = {
          top: $el.offsetTop,
          left: $el.offsetLeft,
          width: $el.offsetWidth,
          height: $el.offsetHeight
        },  
        svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
        poly = document.createElementNS('http://www.w3.org/2000/svg', 'path'),
        width = getWidth(bounds.width, extractedPoints),
        height = getHeight(bounds.height, extractedPoints),
        viewBox = getViewBox(extractedPoints, width, height),
        pointsStr = trace(extractedPoints, bounds),
        svgClasses =  $el.attributes['data-slurve-classes'];

    //attrs
    svg.setAttribute('class', svgClasses ? 'slurve-svg ' + svgClasses.value : 'slurve-svg');
    svg.setAttribute('top', viewBox.y + 'px');
    svg.setAttribute('left', viewBox.x + 'px');
    svg.setAttribute('width', width);
    svg.setAttribute('height', height);
    svg.setAttribute('viewBox', viewBox.rect);
    poly.setAttribute('d', pointsStr);

    //style
    svg.style.top = viewBox.y + 'px';
    svg.style.left = viewBox.x + 'px';

    //update DOM
    svg.appendChild(poly);
    $el.insertBefore(svg, $el.firstChild);
  }
  
  //update all slurve instances
  function updateSlurves() {
    for(var i = 0, len = $slurves.length; i < len; i++) {
      clear($slurves[i]);
      updateSlurve($slurves[i]);
    }
  }
  
  //update all slurve instances after updated query
  function update() {
    $slurves = document.querySelectorAll('[data-slurve]');
    updateSlurves();
  }
  
}.call(this));