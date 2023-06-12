// Predictable random number generator with seeds
class randomizer
{
  constructor(a,b,c,d)
  {
    this.seeda=a;
    this.seedb=b;
    this.seedc=c;
    this.seedd=d;
  }

  // Generate next 8 bit number in pseudo-random sequence
  gen_rnd()
  {
    var a, x;

    x = (this.seeda << 1) & 0xff;
    a = x + this.seedc;

    if (this.seeda > 0x7f)
      a++;

    this.seeda = a & 0xff;
    this.seedc = x;

    a = a / 0x100;    // a = any carry left from above
    x = this.seedb;
    a = (a + x + this.seedd) & 0xff;

    this.seedb = a;
    this.seedd = x;

    return a;
  };

  // Generate pseudo-random number up to 24 bits
  rnd(rmax)
  {
    var res=this.gen_rnd();

    if (rmax>255)
      res=(res<<8)+this.gen_rnd();

    if (rmax>65535)
      res=(res<<8)+this.gen_rnd();

    return (res % rmax);
  };
}
