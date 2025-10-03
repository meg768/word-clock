// Kräver BOSL2
include <BOSL2/std.scad>;

/**
 * Genomgående hex-hål med chamfer uppe och nere.
 * - af: across-flats (mm), ~8.0 för M5
 * - h: total höjd som ska skäras igenom
 * - ch: chamferhöjd (mm) på båda sidor (typ 1 mm)
 * - grow: hur mycket hexan "växer" radiellt för chamfern (standard = ch ≈ 45°)
 */
module hex_hole_through_chamfer(af=8.0, h=10, ch=1.0, grow=undef) {
    R = af / sqrt(3);                       // circumradius för hex
    g = is_undef(grow) ? ch : grow;         // radial expansion för chamfer

    union() {
        // 1) Genomgående rak hex (lite längre än h för säkerhetsmarginal)
        translate([0,0,-0.1])
            linear_extrude(height=h+0.2)
                circle(r=R, $fn=6);

        // 2) Övre chamfer: frustum som blir större uppåt
        translate([0,0,h - ch])
            linear_extrude(height=ch, scale=(R+g)/R)
                circle(r=R, $fn=6);

        // 3) Nedre chamfer: frustum som är större nere och smalnar av uppåt
        translate([0,0,0])
            linear_extrude(height=ch, scale=R/(R+g))
                circle(r=R+g, $fn=6);
    }
}

/**
 * Cylinder Ø15 × 10 mm med chamfer på utsidan OCH chamfrat hex-hål genom hela.
 */
module cylinder_with_hex_through(
    od=15, height=10,
    af=8.0, slack=0.0,
    chamfer=1.0, hex_chamfer=1.0
){
    af_eff = af + slack; // justera passningen (negativ = tight, positiv = spel)

    difference() {
        // Ytterkropp med BOSL2-chamfer (topp + botten)
        cyl(h=height, d=od, chamfer=chamfer, center=false, $fn=128);

        // Genomgående hex-hål med chamfer uppe + nere
        hex_hole_through_chamfer(af=af_eff, h=height, ch=hex_chamfer);
    }
}

// ===== Exempel =====
cylinder_with_hex_through();
// Tips: vill du ha tightare grepp om muttern, sätt t.ex. slack=-0.05.
// Vill du brantare/svagare bevel: justera hex_chamfer (höjden) och/eller 'grow'.
