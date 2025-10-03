// Kräver BOSL2
include <BOSL2/std.scad>;

/**
 * cornerMount med genomgående hex-hål.
 * - diameter: ytterdiameter (mm) [obligatorisk]
 * - height: cylinderhöjd (mm)
 * - acrossFlats: nominell AF för M5 (≈ 8.0 mm)
 * - cylinderChamfer: chamfer på yttercylindern (mm)
 * - hexChamfer: chamfer-höjd på hex-hålet (mm, gäller både topp & botten)
 */

module cornerMount(
    diameter = 15,
    height = 10,
    acrossFlats = 8.0,
    cylinderChamfer = 1.0,
    hexChamfer = 0.5
) {
    // Genomgående hex-hål med chamfer uppe & nere
    module hex_hole_through_chamfer(acrossFlats, h, ch) {
        R = acrossFlats / sqrt(3);
        g = ch;

        union() {
            // Nedre chamfer
            linear_extrude(height=ch, scale=R / (R + g))
                circle(r=R + g, $fn=6);

            // Raka mittdelen
            if (h > 2 * ch)
                translate([0, 0, ch])
                    linear_extrude(height=h - 2 * ch)
                        circle(r=R, $fn=6);

            // Övre chamfer
            translate([0, 0, h - ch])
                linear_extrude(height=ch, scale=(R + g) / R)
                    circle(r=R, $fn=6);
        }
    }

    difference() {
        // ytterkropp med BOSL2-chamfer
        cyl(h=height, d=diameter, chamfer=cylinderChamfer, center=false, $fn=128);

        // genomgående hex-hål
        hex_hole_through_chamfer(acrossFlats, height, hexChamfer);
    }
}

cornerMount(diameter = 15.1, height = 20, acrossFlats = 8.0);
