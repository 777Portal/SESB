export function dateDifferenceSeconds(dt2, dt1) 
{
  var diff = ( dt2.getTime() - dt1.getTime() ) / 1000; // sec
  return Math.abs(Math.round(diff));
}