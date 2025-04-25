DATA_FILE = "data.csv"

print "Data file:", DATA_FILE

set title "Brightness vs Shutter Speed"
set xlabel "Brightness"
set ylabel "Shutter Speed"

set datafile separator ","

plot DATA_FILE every 10 using 1:2 with linespoints title "Shutter Speed" linewidth 1 pointsize 0.5
