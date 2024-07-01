/* http://joeiddon.github.io*/
class Perlin
{
    constructor()
    {
        this.memory = null;
        this.gradients = {};
        this.seed();
        
    }
    _rand_vect()
    {
        let theta = Math.random() * 2 * Math.PI;
        return {x: Math.cos(theta), y: Math.sin(theta)};
    }
    _dot_prod_grid(x, y, vx, vy)
    {
        let g_vect;
        let d_vect = {x: x - vx, y: y - vy};
        if (this.gradients[[vx,vy]])
        {
            g_vect = this.gradients[[vx,vy]];
        } 
        else 
        {
            g_vect = this._rand_vect();
            this.gradients[[vx, vy]] = g_vect;
        }
        return d_vect.x * g_vect.x + d_vect.y * g_vect.y;
    }
    _smootherstep(x)
    {
        return 6*x**5 - 15*x**4 + 10*x**3;
    }
    _interp(x, a, b)
    {
        return a + this._smootherstep(x) * (b-a);
    }
    seed()
    {
        this.gradients = {};
        this.memory = {};
    }
    get(x, y)
    {
        if (this.memory.hasOwnProperty([x,y]))
        {
            return this.memory[[x,y]];
        }
        let xf = Math.floor(x);
        let yf = Math.floor(y);
        //interpolate
        let tl = this._dot_prod_grid(x, y, xf,   yf);
        let tr = this._dot_prod_grid(x, y, xf+1, yf);
        let bl = this._dot_prod_grid(x, y, xf,   yf+1);
        let br = this._dot_prod_grid(x, y, xf+1, yf+1);
        let xt = this._interp(x-xf, tl, tr);
        let xb = this._interp(x-xf, bl, br);
        let v = this._interp(y-yf, xt, xb);
        this.memory[[x,y]] = v;
        return v;
    }
}