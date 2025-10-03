// (Valfritt) BOSL2 – inte nödvändigt i just denna modul
include <BOSL2/std.scad>;

/**
 * Keyhole-hanger (nyckelhåls-upphängning).
 *
 * Parametrar:
 * - plateWidth, plateHeight, plateThickness: mått på brickan
 * - headDiameter: skruvskallens diameter (t.ex. 8.0 mm för vanlig träskruv)
 * - shankWidth: skaftets bredd (t.ex. 4.5 mm för 4–5 mm skruv)
 * - slotLength: längden på den smala slitsen uppåt från huvudhålet
 * - cornerRadius: rundning av brickans hörn
 * - mountHoleDiameter: diameter på två fästhål för att skruva fast brickan
 * - mountHoleSpacing: inbördes avstånd mellan fästhålen (cc)
 *
 * Koordinater:
 * - Plattans centrum i (0,0)
 * - Nyckelhålet: rund del i origo, slits uppåt längs +Y
 */
module keyhole_hanger_plate(
    plateWidth=40,
    plateHeight=25,
    plateThickness=5,
    headDiameter=8.0,
    shankWidth=4.5,
    slotLength=12,
    cornerRadius=3,
    mountHoleDiameter=4,
    mountHoleSpacing=20
) {
    difference() {
        // Plattan: rundade hörn via offset-trick i 2D + extrudera
        linear_extrude(height=plateThickness)
            rounded_rect(plateWidth, plateHeight, cornerRadius);

        // Nyckelhål (genom hela plattan)
        translate([0,0,-0.1])
            linear_extrude(height=plateThickness+0.2)
                keyhole2d(headDiameter, shankWidth, slotLength);

        // Två fästhål för att skruva fast brickan (justerbar placering)
        for (x=[-mountHoleSpacing/2, mountHoleSpacing/2])
            translate([x, -plateHeight/4, -0.1])
                cylinder(h=plateThickness+0.2, d=mountHoleDiameter, $fn=64);
    }
}

/* ===== Hjälpmoduler ===== */

// Nyckelhål i 2D: rund huvuddel + smal slits uppåt.
module keyhole2d(headD, shankW, slotL) {
    union() {
        // Rund öppning för skruvskalle (centrum i origo)
        circle(d=headD, $fn=64);

        // Smal slits uppåt: bredd = shankW, längd = slotL
        translate([0, slotL/2])
            square([shankW, slotL], center=true);
    }
}

// Rundad rektangel med hörnradie r
module rounded_rect(w, h, r) {
    rr = min(r, min(w,h)/2);
    offset(r=rr) offset(delta=-rr) square([w, h], center=true);
}

/* ===== Exempel ===== */
keyhole_hanger_plate();              // default
// Ex: lite större huvud för grov skruv
// translate([60,0,0]) keyhole_hanger_plate(headDiameter=10, shankWidth=5, slotLength=16);
