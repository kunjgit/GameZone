// Timeline object
class timelineobj
{

  constructor()
  {
    this.timeline=[]; // Array of actions
    this.timelinepos=0; // Point in time of last update
    this.timelineepoch=0; // Epoch when timeline was started
    this.callback=null; // Optional callback on each timeline "tick"
    this.running=false; // Start in non-running state
  }

  // Add a new function to timeline with a given start time
  add(itemstart, newitem)
  {
    var newobj={start:itemstart, item:newitem, done:false};

    this.timeline.push(newobj);

    // Keep timeline sorted by start time of items
    this.timeline.sort(function(a,b) {return ((b.start<a.start)?1:(b.start==a.start)?0:-1)});
  }

  // Add a timeline callback
  addcallback(item)
  {
    this.callback=item;
  }

  // Animation frame callback
  timelineraf(timestamp)
  {
    var remain=0;

    // Stop further processing if we're not running
    if (!this.running) return;

    // If this is the first call then just record the epoch
    if (this.timelinepos==0)
    {
      this.timelineepoch=timestamp;
    }
    else
    {
      // Calculate delta time since timeline start
      var delta=timestamp-this.timelineepoch;

      // Look through timeline array for jobs not run which should have
      for (var i=0; i<this.timeline.length; i++)
      {
        if ((!this.timeline[i].done) && (this.timeline[i].start<delta))
        {
          this.timeline[i].done=true;
          this.timeline[i].item();
        }

        // Keep a count of all remaining jobs
        if (!this.timeline[i].done)
          remain++;
      }

      // If a callback was requested, then call it
      if (this.callback!=null)
        this.callback();
    }

    // Record new timeline position
    this.timelinepos=timestamp;

    // If there is more jobs then request another callback
    if ((this.timelinepos==this.timelineepoch) || (remain>0))
      window.requestAnimationFrame(this.timelineraf.bind(this));
  }

  // Start the timeline running
  begin()
  {
    this.running=true;

    window.requestAnimationFrame(this.timelineraf.bind(this));
  }

  // Stop the timeline running
  end()
  {
    this.running=false;
  }

  // Reset the timeline to be used again
  reset()
  {
    this.running=false; // Start in non-running state

    this.timeline=[]; // Array of actions
    this.timelinepos=0; // Point in time of last update
    this.timelineepoch=0; // Epoch when timeline was started
    this.callback=null; // Optional callback on each timeline "tick"
  }
}
