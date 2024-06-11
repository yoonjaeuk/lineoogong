var svg = d3
  .select('#renderer')
  .append('svg')
  .attr('width', 1500)
  .attr('height', 800);
var title = d3.select('#title_renderer').append('svg');
var d;

var L_weight_d = 10;
var L_weight_s = 10;
var L_weight_n = 10;
var L_weight_m = 10;

var R_weight_d = 10;
var R_weight_s = 10;
var R_weight_n = 10;
var R_weight_m = 10;

var group1 = svg.append('g');
var group2 = svg.append('g');
var groupLine = svg.append('g');

var rankOrigin = [];
var rankWeighted = [];

function L_listen(c0, c1, c2) {
  group1.remove();
  group1 = svg.append('g');
  group1.attr('transform', 'translate(0,0)');
  L_weight_d = c0;
  L_weight_s = c1 - c0;
  L_weight_n = c2 - c1;
  L_weight_m = 40 - c2;

  rankSort(L_weight_d, L_weight_s, L_weight_n, L_weight_m);
  rankOrigin = makeRank();
  update(d, group1, L_weight_d, L_weight_s, L_weight_n, L_weight_m);
  drawCompareLine();
}

function R_listen(c0, c1, c2) {
  group2.remove();
  group2 = svg.append('g');
  group2.attr('transform', 'translate(750,0)');

  R_weight_d = c0;
  R_weight_s = c1 - c0;
  R_weight_n = c2 - c1;
  R_weight_m = 40 - c2;

  rankSort(R_weight_d, R_weight_s, R_weight_n, R_weight_m);
  rankWeighted = makeRank();
  update(d, group2, R_weight_d, R_weight_s, R_weight_n, R_weight_m);
  drawCompareLine();
}

function makeRank() {
  var rank = {};
  for (var i = 0; i < d.length; i++) {
    rank[d[i].name] = i;
  }
  return rank;
}

function drawCompareLine() {
  var keys = Object.keys(rankOrigin);
  groupLine.remove();
  groupLine = svg.append('g');
  groupLine.attr('transform', 'translate(630,10)');
  for (var i = 0; i < keys.length; i++) {
    if (Math.abs(rankOrigin[keys[i]] - rankWeighted[keys[i]]) > 10) {
      var num = rankOrigin[keys[i]] * 1 - rankWeighted[keys[i]] * 1;
      groupLine
        .append('text')
        .attr('x', 6)
        .attr('y', rankOrigin[keys[i]] * 27 + 5)
        .text(num + ' ')
        .attr(
          'fill',
          rankOrigin[keys[i]] > rankWeighted[keys[i]] ? '#f00' : '#00f',
        );
    }
    var num = rankOrigin[keys[i]] * 1 - rankWeighted[keys[i]] * 1;

    if (rankOrigin[keys[i]] === rankWeighted[keys[i]]) {
      groupLine
        .append('text')
        .attr('x', 25)
        .attr('y', rankOrigin[keys[i]] * 27 + 5)
        .text(num + ' ')
        .attr('fill', '#3f4040')
        .style('font', '14px gothic');

      if (Math.abs(rankOrigin[keys[i]] - rankWeighted[keys[i]]) < 10) {
        groupLine
          .attr('x1', 50)
          .attr('x2', 100)
          .attr('y1', rankOrigin[keys[i]] * 27)
          .attr('y2', rankWeighted[keys[i]] * 27)
          .attr('stroke', '#3f4040');
      }
    } else {
      groupLine
        .append('text')
        .attr('x', 25)
        .attr('y', rankOrigin[keys[i]] * 27 + 5)
        .text(num + ' ')
        .attr(
          'fill',
          rankOrigin[keys[i]] > rankWeighted[keys[i]] ? '#f00' : '#00f',
        )
        .style('font', '14px gothic');

      if (Math.abs(rankOrigin[keys[i]] - rankWeighted[keys[i]]) < 10) {
        groupLine
          .attr('x1', 50)
          .attr('x2', 100)
          .attr('y1', rankOrigin[keys[i]] * 27)
          .attr('y2', rankWeighted[keys[i]] * 27)
          .attr(
            'stroke',
            rankOrigin[keys[i]] > rankWeighted[keys[i]] ? '#f00' : '#00f',
          );
      }
    }
  }
}

function rankSort(w_d, w_s, w_n, w_m) {
  var ret = _.sortBy(d, function (each) {
    var col =
      each['profit'] * w_d +
      each['growth'] * w_s +
      each['safety'] * w_n +
      each['efficiency'] * w_m;
    return -col;
  });
  d = ret;
}

d3.json('visual/weightcode.json', function (data) {
  d = data;
  rankSort(10, 10, 10, 10);
  rankOrigin = makeRank();
  rankWeighted = makeRank();

  drawCompareLine();

  group1.attr('transform', 'translate(0, 0)');
  group2.attr('transform', 'translate(750, 0)');
  update(d, group1, L_weight_d, L_weight_s, L_weight_n, L_weight_m);
  update(d, group2, R_weight_d, R_weight_s, R_weight_n, R_weight_m);
});

title
  .append('text')
  .attr('y', 20)
  .attr('font-size', 13)
  .attr('x', 1)
  .text('R')
  .style('font', '15px notosanskr');

title
  .append('text')
  .attr('y', 20)
  .attr('font-size', 13)
  .attr('x', 17)
  .text('Clu')
  .style('font', '15px notosanskr');

title
  .append('text')
  .attr('y', 20)
  .attr('x', 60)
  .text('idnumber')
  .style('font', '17px notosanskr');

title
  .append('text')
  .attr('y', 20)
  .attr('x', 180)
  .text('name')
  .style('font', '17px notosanskr');

title
  .append('text')
  .attr('y', 20)
  .attr('x', 754)
  .text('R')
  .style('font', '15px notosanskr');

title
  .append('text')
  .attr('y', 20)
  .attr('x', 930)
  .text('name')
  .style('font', '17px notosanskr');

title
  .append('text')
  .attr('y', 20)
  .attr('x', 180)
  .text('name')
  .style('font', '17px notosanskr');

function update(d, parent, weight_d, weight_s, weight_n, weight_m) {
  var height = 27;

  var rows = parent.selectAll('g.row').data(d, function (d) {
    return d.name;
  });

  var rowsEnter = rows
    .enter()
    .append('g')
    .attr('class', 'row')
    .attr('transform', function (d, i) {
      return 'translate(0,' + i * height + ')';
    });

  rowsEnter
    .append('rect')
    .attr('height', height)
    .attr('width', 750)
    .attr('x', 0)
    .attr('fill', '#f5f5f7');

  rowsEnter
    .append('text')
    .attr('y', 15)
    .attr('font-size', 13)
    .attr('x', 1)
    .text(function (d, i) {
      return i + 1 + '.';
    });

  rowsEnter
    .append('text')
    .attr('y', 15)
    .attr('font-size', 13)
    .attr('x', 25)
    .text(function (d, i) {
      return i + 1 + '.';
    });

  rowsEnter
    .append('text')
    .attr('y', 15)
    .attr('font-size', 13)
    .attr('x', 170)
    .text(function (d) {
      return d.name.length > 10 ? d.name.slice(0, 10) + '...' : d.name;
    });

  rowsEnter
    .append('text')
    .attr('y', 15)
    .attr('font-size', 13)
    .attr('x', 70)
    .text(function (d) {
      return d.id.length > 10 ? d.id.slice(0, 10) + '...' : d.id;
    });

  rowsEnter
    .append('rect')
    .attr('height', height - 2)
    .attr('x', 350)
    .attr('fill', '#000000')
    .attr('width', function (d) {
      return (d['profit'] * weight_d) / 20;
    });

  rowsEnter
    .append('rect')
    .attr('height', height - 2)
    .attr('x', function (d) {
      return 350 + (d['profit'] * weight_d) / 20;
    })
    .attr('fill', '#708090')
    .attr('width', function (d) {
      return (d['growth'] * weight_s) / 20;
    });

  rowsEnter
    .append('rect')
    .attr('height', height - 2)
    .attr('x', function (d) {
      return (
        350 + (d['profit'] * weight_d) / 20 + (d['growth'] * weight_s) / 20
      );
    })
    .attr('fill', '#696969')
    .attr('width', function (d) {
      return (d['safety'] * weight_n) / 20;
    });

  rowsEnter
    .append('rect')
    .attr('height', height - 2)
    .attr('x', function (d) {
      return (
        350 +
        (d['profit'] * weight_d) / 20 +
        (d['growth'] * weight_s) / 20 +
        (d['safety'] * weight_n) / 20
      );
    })
    .attr('fill', '#A9A9A9')
    .attr('width', function (d) {
      return (d['efficiency'] * weight_m) / 20;
    });

  rows
    .transition()
    .duration(750)
    .attr('transform', function (d, i) {
      return 'translate(0,' + i * height + ')';
    });

  rows.select('rect').transition().duration(750).attr('width', 750);

  rows.selectAll('text').transition().duration(750).attr('y', 15);

  rows
    .select('rect:nth-child(3)')
    .transition()
    .duration(750)
    .attr('width', function (d) {
      return (d['profit'] * weight_d) / 20;
    });

  rows
    .select('rect:nth-child(4)')
    .transition()
    .duration(750)
    .attr('width', function (d) {
      return (d['growth'] * weight_s) / 20;
    });

  rows
    .select('rect:nth-child(5)')
    .transition()
    .duration(750)
    .attr('width', function (d) {
      return (d['safety'] * weight_n) / 20;
    });

  rows
    .select('rect:nth-child(6)')
    .transition()
    .duration(750)
    .attr('width', function (d) {
      return (d['efficiency'] * weight_m) / 20;
    });

  rows.exit().remove();
}
