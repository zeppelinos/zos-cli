set -ex

jobcount() {
  x=`jobs -r | wc -l | tr -d " \n"`
  echo $x
}

waiton() {
  while [ `jobcount` == $1 ]; do sleep 5; done
}

npx truffle compile

for f in $(ls test/**/*.test.js); do
  npm test -- $f &
  waiton $CONCURRENCY
done

wait
