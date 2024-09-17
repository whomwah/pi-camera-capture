# Webcam

A Deno program that takes snapshots from a Raspberry Pi camera, uploads it to S3
and then creates a time-lapse video with the results. Also has a script to take
a live photo.

- uses a [Raspberry Pi 4 Model
  B](https://www.raspberrypi.com/products/raspberry-pi-4-model-b/) and [Camera
  Module 3](https://www.raspberrypi.com/products/camera-module-3/)
- uses `libcamera-still` to create a snapshot
- uses `convert` to annotate the snapshot with the current time
- uses `s3` to upload the snapshot to S3
- uses `ffmpeg` to create a time-lapse video

It works via a cron job that runs at various times during the day.

```
0 10 * * * /home/webcam/_dev/webcam/webcam >> /home/webcam/_dev/webcam/output.log 2>&1
0 16 * * * /home/webcam/_dev/webcam/webcam >> /home/webcam/_dev/webcam/output.log 2>&1
*/5 * * * * /home/webcam/_dev/webcam/webcam-live >> /home/webcam/_dev/webcam/output-live.log 2>&1
```

Currently running on a camera situated in the [Kyan office](https://kyan.com/)
of the development of the StMarys Wharf project.

- https://www.youtube.com/playlist?list=PLLNZI-dmwJyj45BKexQVYLdbpj4xv_ZnB
