// Kräver BOSL2
include <BOSL2/std.scad>;

/**
 * Genomgående hex-hål med chamfer uppe och nere.
 * - af: across-flats (mm), ~8.0 för M5
 * - h: total höjd som ska skäras igenom
 * - ch: chamferhöjd (mm) på båda sidor (t.ex. 0.5 mm)
 */
module hex_hole_through_chamfer(af=8.0, h=10, ch=0.5) {
    R = af / sqrt(3);                       // circumradius för hex
    g = ch;                                 // radial expansion ≈ chamferhöjd

    union() {
        // Genomgående rak hex
        translate([0,0,-0.1])
            linear_extrude(height=h+0.2)
                circle(r=R, $fn=6);

        // Övre chamfer
        translate([0,0,h - ch])
            linear_extrude(height=ch, scale=(R+g)/R)
                circle(r=R, $fn=6);

        // Nedre chamfer
        linear_extrude(height=ch, scale=R/(R+g))
            circle(r=R+g, $fn=6);
    }
}

/**
 * Cylinder Ø15 × 10 mm med genomgående hex-hål + chamfer.
 */
module cylinder_with_hex_through(
    od=15, height=10,
    af=8.0, slack=0.0,
    chamfer=1.0, hex_chamfer=0.5
){
    af_eff = af + slack; // justera passningen

    difference() {
        // Ytterkropp med BOSL2-chamfer
        cyl(h=height, d=od, chamfer=chamfer, center=false, $fn=128);

        // Hex-hål genom hela kroppen, med 0.5 mm chamfer på båda sidor
        hex_hole_through_chamfer(af=af_eff, h=height, ch=hex_chamfer);
    }
}

// ===== Exempel =====
cylinder_with_hex_through();
