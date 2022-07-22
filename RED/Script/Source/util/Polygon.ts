namespace Script {

    export class Polygon {

        points: ƒ.Vector2[];

        constructor(x: ƒ.Vector2[] = []) {
            this.points = x;
        }

        public pnpoly(test: ƒ.Vector2): boolean {
            let c = false;
            for (let i = 0, j = this.points.length - 1; i < this.points.length; j = i++) {
                if (((this.points[i].y > test.y) != (this.points[j].y > test.y)) &&
                    (test.x < (this.points[j].x - this.points[i].x) * (test.y - this.points[i].y) / (this.points[j].y - this.points[i].y) + this.points[i].x))
                    c = !c;
            }
            return c;
        }
    }

}