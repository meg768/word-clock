include <BOSL2/std.scad>

$fn = 128;

// Diameter of the wall mount insert
A = 23.8;

// Djup på väggfäste
B = 11;

// Diameter på stor slits 
C = 11;

// Diameter på liten slits
D = 5;

// Avstånd till kant på stor slits
E = 3;

// Djup på stor slits 
F = 5.5;

// Chamfer 
X = 1;

module main() {

    difference()  {
        up(B / 2) {
            #cyl(d=A, h=B, chamfer=X);
        }

        up(-F / 2 + B) {
            hull() {
                back(A / 2 - C / 2 - E) {
                    cyl(d=C, h=F);
                }
                fwd(A / 2 - C / 2 - E) {
                    cyl(d=C, h=F);
                }
            }
        }
        up(B / 2) {
            hull() {
                back(A / 2 - D / 2 - E - (C - D) / 2) {
                    cyl(d=D, h=B);
                }
                fwd(A / 2 - D / 2 - E - (C - D) / 2) {
                    cyl(d=D, h=B);
                }
            }
        }

        up(B/2) {
            fwd(A/2-C/2-E) {
                cyl(d=C, h=B);
            }
        }
    }
}

main();
