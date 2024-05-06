# Webcam

A simple Deno program that uses `libcamera-still` to create a snapshot to a
folder and then renames that snapshot with the timestamp. Finally it uploads
that image to S3.

It works via a cron job that runs at midday every day.

```
0 12 * * * /home/webcam/_dev/webcam/webcam >> /home/webcam/_dev/webcam/output.log 2>&1
```
