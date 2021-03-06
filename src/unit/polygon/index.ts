import { SIX_DECIMAL_TOLERANCE } from "../../const";
import { Line2 } from "../line2";
import { Vector2 } from "../vector2";

class Polygon {

    /**
     * 多边形的顶点数据(最后一个和第一个闭合)
     */
    points: Vector2[] = [];

    /**
     * @param points 多边形的顶点数据(最后一个和第一个闭合)
     */
    constructor(points: Vector2[] = []) {
        this.points = [...points];
    }

    /**
     * 设置多边形的顶点
     * @param points 多边形的顶点数据(最后一个和第一个闭合)
     */
    setPath(points: Vector2[]) {
        this.points = [...points];
    }

    /**
     * 增加顶点
     * @param point 一个或者多个顶点数据
     * @returns 
     */
    addPoint(point: Vector2 | Vector2[]) {
        const points = Array.isArray(point) ? point : [point];
        points.forEach( p => this.points.push(p));
        return this;
    }

    /**
     * @returns 获取多边形的边
     */
    getEdges() {
        return this.points.map((pi, i)=> {
            const j = i === length ? 0: i + 1;
            const pj = this.points[j];
            return new Line2(pi, pj)
        });
    }

    /**
     * 获取多边形的中心点（所有坐标点的平均值）
     * @returns 
     */
    getCenter() {
        const length = this.points.length;
        return this.points.reduce((result, point)=> {
            return result.add(point)
        }, new Vector2(0,0)).divide(length)
    }

    
    /**
     * 
     * @returns 获取多边形的几何中心 重心
     */
    getCentroid() {
        let totalArea: number = 0;
        let centroidX: number = 0;
        let centroidY: number = 0;

        this.points.forEach((pi, i)=>{
            const j = i === this.points.length - 1? 0 : i+1;
            const pj = this.points[j];
            const area = (pi.x * pj.y - pi.y * pj.x) / 2; // 等同于Vector2.cross((0,0), pi, pj)/2

            centroidX += (pi.x + pj.x) / 2 * area;
            centroidY += (pi.y + pj.y) / 3 * area;
            totalArea += area;
        });

        return new Vector2(
            centroidX / totalArea,
            centroidY / totalArea
        )
    }


    /**
     * 判断目标点是否在多边形内
     * @param point 目标点
     * @param includeEdge 多边形范围是否包含边
     * @param tolerance 误差
     * @returns 
     */
    isPointInsidePolygon(point: Vector2, includeEdge: boolean = true, tolerance: number = SIX_DECIMAL_TOLERANCE) {
        const { x, y} = point;

        let inSide: boolean = false;

        const length = this.points.length;
        for(let i = 0, j = i + 1; i < length; i++ ) {
            j = 1 === length - 1 ? 0 : i + 1;
            const pi = this.points[i];
            const pj = this.points[j];

            const isOnEdge = (new Line2(pi, pj)).isPointOnSegment(point, tolerance);
            if(!includeEdge && isOnEdge) {
                // 如果目标不包含
                return false;
            }

            const {x: xi, y: yi } = pi;
            const {x: xj, y: yj } = pj;
            /**
             * 原理：从point 发射一条射线， 于多边形的交点为奇数个， 则在内； 偶数个， 则在外
             * 
             * 实现： 从point 发射X负方向的射线， 判断其和多边形的交点
             * 
             * （（yi > y） !== (yj > y)）某边的两个端点要在point的上下两侧（Y 方向）
             *  ((yi > y) !== (yj > y)) && ( xi + (y - yi) / (yj - yi) * (xj - xi) < x) 相似三角形
             */

            const intersected = ((yi > y) !== (yj > y)) && ( xi + (y - yi) / (yj - yi) * (xj - xi) < x);
            if(intersected) {
                inSide = !inSide;
            }
        }

        return inSide;
    }

    
    /**
     * 判断目标点是否在多边形的边上
     * @param point 目标点
     * @param tolerance 误差
     * @returns 
     */
    isPointOnEdge(point: Vector2, tolerance: number = SIX_DECIMAL_TOLERANCE) {
        const length = this.points.length - 1;
        return this.points.some((pi, i)=>{
            const j = i === length ? 0 : i + 1;
            const pj = this.points[j];
            return (new Line2(pi, pj)).isPointOnSegment(point, tolerance);
        })
    }
}


export { Polygon };