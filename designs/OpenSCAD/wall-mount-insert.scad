include <BOSL2/std.scad>

$fn = 128;

// Diameter of the wall mount insert
A = 25;
// Djup på väggfäste
B = 10;

// Chamfer 
X = 1;

module base() {
    cyl(d=A, h=B, chamfer=X);
}


base();
