import { SIX_DECIMAL_TOLERANCE  } from "../../const";
import { Vector2Util } from "../../utils/vector2";
import { Line2, LineSide } from "../line2";
import { Vector2 } from "../vector2";

/**
 * 表示二维世界中的一个三角形
 */
class Triangle2 {
    
    /**
     * 三角形的顶点数据
     */
    points: Vector2[] = [];

    /**
     * @param points 三角形的顶点数据 
     */
    constructor(points: Vector2[] = []) {
        this.points = [...points];
    }

    /**
     * 设置三角形的顶点数据
     * @param points 
     * @returns 
     */
    setPoints(points: Vector2[]) {
        this.points = [...points];
        return this;
    }

    /**
     * 设置三角形的顶点坐标
     * @param point 顶点坐标
     * @param index 顶点位置
     * @returns 
     */
    setPoint(point: Vector2, index: 0 | 1 | 2) {
        this.points[index] = point;
        return this;
    }

    /**
     *  拷贝当前三角形
     * @returns 
     */
    clone() {
        return new Triangle2(this.points.map(p => p.clone()));
    }

    /**
     * 获得当前三角形的面积
     * @returns 
     */
    getArea() {
        const [a, b, c] = this.points;
        return Vector2Util.cross3(a, b, c) / 2;
    }

    /**
     * 获取三角形的重心
     * @returns 
     */
    getCentroid() {
        const [a, b, c] = this.points;
        const x = (a.x + b.x + c.x) / 3;
        const y = (a.y + b.y + c.y) / 3;
        return new Vector2(x, y);
    }

    /**
     *  获取三角形的边
     * @returns 
     */
    getEdges() {
        const length = this.points.length;
        return this.points.map((pi, i)=> {
            const j = i === length ? 0 : i + 1;
            const pj = this.points[j];
            return new Line2(pi, pj);
        })
    }

    /**
     * 判断点是否在三角形内部 sin 同一个方向
     * @param point 目标点
     * @param includeEdge 三角形的范围是否包含边
     * @param tolerance 
     * @returns 
     */
    isPointInsideTriangle(point: Vector2, includeEdge: boolean = true, tolerance: number = SIX_DECIMAL_TOLERANCE) {
        /**
         * cross 点和三角形每一条边方向相同
         */
        const edges = this.getEdges();
        let lastSide: LineSide;
        for(let i = 0; i < edges.length; i++) {
            const side = edges[i].getSide(point, tolerance);
            if(side === LineSide.On) {
                return includeEdge;
            }
            if(lastSide === void 0) {
                lastSide = side;
            }
            if(side != lastSide) {
                return false;
            }
        }

        return true;
    }
}

export { Triangle2 }