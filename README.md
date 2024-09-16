# Webcam

A Deno program that takes a snapshot from a camera and uploads it to S3 and
creates a time-lapse video.

- uses `libcamera-still` to create a snapshot
- uses `convert` to annotate the snapshot with the current time
- uses `s3` to upload the snapshot to S3
- uses `ffmpeg` to create a time-lapse video

It works via a cron job that runs at various times during the day.

```
0 12 * * * /home/webcam/_dev/webcam/webcam >> /home/webcam/_dev/webcam/output.log 2>&1
```
