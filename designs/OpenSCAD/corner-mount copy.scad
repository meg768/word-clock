// Kräver BOSL2
include <BOSL2/std.scad>;

/**
 * M5 mutter (huvud) som solid hexprisma.
 * - af: across-flats (mm), ~8.0 för M5 (ISO 4032)
 * - thickness: mutterhöjd, ~4.0 mm
 * - chamfer: valfri avfasning på båda sidor (0 = ingen)
 */
module m5_nut_head(af=8.0, thickness=4.0, chamfer=0.3) {
    R = af / sqrt(3);  // circumradius för hex
    // Hexkropp (använd $fn=6 för exakt sexkant)
    cyl(h=thickness, r=R, $fn=6,
        chamfer1=-chamfer, chamfer2=-chamfer);
}

// ===== Exempel =====
m5_nut_head();
