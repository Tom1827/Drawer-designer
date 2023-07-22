function main() {
  var drawer_width = parseInt(document.getElementById("drawer_width").value);
  var drawer_depth = parseInt(document.getElementById("drawer_depth").value);
  var drawer_height = parseInt(document.getElementById("drawer_height").value);
  var count = parseInt(document.getElementById("count").value);

  var material_thickness = parseInt(
    document.getElementById("material_thickness").value
  );
  var material_width = parseInt(
    document.getElementById("material_width").value
  );
  var material_height = parseInt(
    document.getElementById("material_height").value
  );
  var cut_width = parseInt(document.getElementById("cut_width").value);
  // var arrangement = document.getElementById("arrange").value;

  let arrangement = document.querySelector(
    'input[name="arrange"]:checked'
  ).value;

  let rotate_base = document.querySelector("#rotate_base").checked ? 90 : 0;
  let rotate_sides = document.querySelector("#rotate_sides").checked ? 90 : 0;
  let rotate_fb = document.querySelector("#rotate_fb").checked ? 90 : 0;

  var outer_margin;
  var inner_margin;

  switch (arrangement) {
    case "no_margin": {
      outer_margin = 0;
      inner_margin = 0;
      break;
    }

    case "inner_only": {
      outer_margin = 0;
      inner_margin = cut_width;
      break;
    }

    case "inner_outer": {
      outer_margin = cut_width;
      inner_margin = cut_width;
      break;
    }
  }

  let material = {
    w: parseInt(material_width),
    h: parseInt(material_height),
    t: parseInt(material_thickness),
  };

  boxes = [];

  for (var c = 1; c <= count; c++) {
    // base - fits into a rabbet on all upright pieces, so needs to be
    // smaller in both dimensions by one full material thickness

    boxes.push({
      // w: Math.max(drawer_width, drawer_depth) - material.t,
      // h: Math.min(drawer_width, drawer_depth) - material.t,
      w:
        rotate_base == 0
          ? drawer_width - material.t
          : drawer_depth - material.t,
      h:
        rotate_base == 0
          ? drawer_depth - material.t
          : drawer_width - material.t,
      label: c + " / base",
      rotation: rotate_base,
      rabbets: [""],
    });

    // sides (left and right)
    // - full size of relevant dimensions
    // - rabbet on both sides and bottom
    let sides = {
      // w: Math.max(drawer_height, drawer_depth),
      // h: Math.min(drawer_height, drawer_depth),
      w: rotate_sides == 0 ? drawer_depth : drawer_height,
      h: rotate_sides == 0 ? drawer_height : drawer_depth,
      label: c + " / side",
      rotation: rotate_sides,
      rabbets: ["1", "2", "3"], // 0,1,2,3: top, right, bottom, left
    };
    boxes.push(sides);
    boxes.push(sides);

    // front and back
    // - fit into rabbet on sides, so smaller width by one full material thickness
    // - rabbet on bottom edge
    let fb = {
      // w: Math.max(drawer_height, drawer_width) - material.t,
      // h: Math.min(drawer_height, drawer_width),
      w: rotate_fb == 0 ? drawer_width - material.t : drawer_height,
      h: rotate_fb == 0 ? drawer_height : drawer_width - material.t,
      label: c + " / front-back",
      rotation: rotate_fb,
      rabbets: ["2"],
    };
    boxes.push(fb);
    boxes.push(fb);
  }

  // ===== run the fitting algorithm =====
  result = fit(boxes, material, inner_margin);

  // Update page with results
  document.getElementById("message").innerHTML = `${(_ =
    result.packed.length == boxes.length
      ? ""
      : "<b style='color:#8B0000'>Only ")}${result.packed.length}/${
    boxes.length
  } elements are included in this layout${(_ =
    result.packed.length == boxes.length ? "" : "</b>")} which starts with ${
    result.start_area
  } cm² and wastes ~${result.waste_area} cm², or ~${
    result.waste_perecentage
  }%.`;

  // Draw results on the canvas
  draw_results(result);
}

// =
// ========= Draw results on canvas ========
function draw_results(result) {
  const canvas = document.getElementById("cvs");
  const ctx = canvas.getContext("2d");

  // Make the canvas square, and fit to the window width
  ctx.canvas.width = window.innerWidth;
  ctx.canvas.height = window.innerWidth;

  let s = Math.min(
    canvas.height / result.material.h,
    canvas.width / result.material.w
  );

  ctx.clearRect(0, 0, canvas.width, canvas.height); // clear canvas

  ctx.fillStyle = "#4444ff";
  ctx.fillRect(0, 0, result.material.w * s, result.material.h * s);  // draw blue background for area used

  result.packed.forEach((e) => {
    r(e, s, "#eeeeee", ctx, result.material);
  });

  result.spaces.forEach((e) => {
    r(e, s, "rgba(255, 100, 100, 0.5)", ctx, result.material);
  });
}

// =
// ========= Draw an element of the drawer or space =========
function r(e, s, fill, ctx, material) {
  ctx.fillStyle = fill;
  ctx.lineWidth = 1;
  ctx.strokeStyle = "#111111";

  xs = parseInt(e.x * s);
  ys = parseInt(e.y * s);
  ws = parseInt(e.w * s);
  hs = parseInt(e.h * s);
  ms = material.t * s;

  // rectangles
  ctx.fillRect(xs, ys, ws, hs);
  ctx.strokeRect(xs, ys, ws, hs);

  //label
  if (e.label) {
    ctx.fillStyle = "#000000";
    ctx.font = "14px Arial";
    ctx.fillText(e.label, xs + ms + 1, ys + ms + 14);
    ctx.font = "11px Arial";
    ctx.fillText(`${e.w}mm x ${e.h}mm`, xs + ms + 1, ys + ms + 27);
  } else {
    //diagonal line
    ctx.beginPath();
    ctx.moveTo(xs, ys);
    ctx.lineTo((e.w + e.x) * s, (e.h + e.y) * s);
    ctx.stroke();
  }

  if (e.rabbets) {
    // rabbets
    ctx.fillStyle = "rgba(10, 255, 10, 0.5)";

    if (e.rotation == 0) {
      if (e.rabbets.includes("0")) {
        ctx.fillRect(xs, ys, ws, ms);
      }
      if (e.rabbets.includes("1")) {
        ctx.fillRect(xs + ws - ms, ys, ms, hs);
      }
      if (e.rabbets.includes("2")) {
        ctx.fillRect(xs, ys + hs - ms, ws, ms);
      }
      if (e.rabbets.includes("3")) {
        ctx.fillRect(xs, ys, ms, hs);
      }
    }
    if (e.rotation == 90) {
      if (e.rabbets.includes("1")) {
        ctx.fillRect(xs, ys, ws, ms);
      }
      if (e.rabbets.includes("2")) {
        ctx.fillRect(xs + ws - ms, ys, ms, hs);
      }
      if (e.rabbets.includes("3")) {
        ctx.fillRect(xs, ys + hs - ms, ws, ms);
      }
      if (e.rabbets.includes("0")) {
        ctx.fillRect(xs, ys, ms, hs);
      }
    }
  }
}

//
//  ================================================================================
//

function fit(boxes, material, inner_margin) {
  // calculate total box area and maximum box width
  let area = 0;
  let maxWidth = 0;
  for (const box of boxes) {
    area += box.w * box.h;
    maxWidth = Math.max(maxWidth, box.w);
  }

  // sort by area, first
  boxes.sort((a, b) => b.w * b.h - a.w * b.h);

  // sort the boxes for insertion by height, descending
  boxes.sort((a, b) => b.h - a.h);

  // aim for a squarish resulting container,
  // slightly adjusted for sub-100% space utilization
  // const startWidth = Math.max(Math.ceil(Math.sqrt(area / 0.95)), maxWidth);

  // start with a single empty space, unbounded at the bottom
  const spaces = [{ x: 0, y: 0, w: material.w, h: material.h }];
  const material_area = { w: material.w, h: material.h };
  const packed = [];

  for (const box of boxes) {
    // look through spaces backwards so that we check smaller spaces first
    for (let i = spaces.length - 1; i >= 0; i--) {
      const space = spaces[i];

      // look for empty spaces that can accommodate the current box
      // if (box.w > space.w || box.h > space.h) {
      //   continue;
      // }

      if (box.w <= space.w && box.h <= space.h) {
        //fits
      } else if (box.w <= space.h && box.h <= space.w) {
        // fits with rotation
        [box.w, box.h] = [box.h, box.w];
        box.rotation = box.rotation == 90 ? 0 : 90;
      } else {
        continue;
      }

      // found the space; add the box to its top-left corner
      // |-------|-------|
      // |  box  |       |
      // |_______|       |
      // |         space |
      // |_______________|

      packed.push(
        Object.assign({}, box, {
          x: space.x,
          y: space.y,
          label: box.label,
          rotation: box.rotation,
          rabbets: box.rabbets,
        })
      );

      if (box.w === space.w && box.h === space.h) {
        // space matches the box exactly; remove it
        const last = spaces.pop();
        if (i < spaces.length) spaces[i] = last;
      } else if (box.h === space.h) {
        // space matches the box height; update it accordingly
        // |-------|---------------|
        // |  box  | updated space |
        // |_______|_______________|
        space.x += box.w + inner_margin;
        space.w -= box.w + inner_margin;
        space.y;
      } else if (box.w === space.w) {
        // space matches the box width; update it accordingly
        // |---------------|
        // |      box      |
        // |_______________|
        // | updated space |
        // |_______________|
        space.y += box.h;
        space.h -= box.h;
      } else {
        // otherwise the box splits the space into two spaces
        // |-------|-----------|
        // |  box  | new space |
        // |_______|___________|
        // | updated space     |
        // |___________________|
        spaces.push({
          x: space.x + box.w + inner_margin,
          y: space.y, // + first_margin + other_margin,
          //w: space.w - (box.w + first_margin + other_margin),
          w: space.w - box.w - inner_margin,
          h: box.h, // + first_margin,
        });
        space.y += box.h + inner_margin;
        space.h -= box.h + inner_margin;
      }
      break;
    }
  }

  let waste_area = (
    spaces.reduce(function (accumulator, item) {
      return accumulator + item.w * item.h;
    }, 0) / 100
  ).toFixed(1);
  let start_area = ((material.w * material.h) / 100).toFixed(1);
  let waste_perecentage = ((waste_area / start_area) * 100).toFixed(1);

  return {
    packed,
    spaces,
    material,
    start_area,
    waste_area,
    waste_perecentage,
  };
}
//
