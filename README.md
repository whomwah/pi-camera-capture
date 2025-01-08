# Webcam

A collection of Deno programs that use a Raspberry Pi camera to take snapshots,
upload it to S3, and optiontionally create a time-lapse video with the results.

- uses a
  [Raspberry Pi 4 Model B](https://www.raspberrypi.com/products/raspberry-pi-4-model-b/)
  and
  [Pi HQ Camera](https://www.raspberrypi.com/products/raspberry-pi-high-quality-camera/)
- uses `libcamera-still` to create a snapshot
- uses `convert` to annotate the snapshot with the current time
- uses `s3` to upload the snapshot to S3
- uses `ffmpeg` to create a time-lapse video

## Usage

The idea is it runs via a cron job that runs at various times during the day.

```
0 10 * * * /home/webcam/_dev/webcam/webcam >> /var/log/webcam/webcam.log 2>&1
0 16 * * * /home/webcam/_dev/webcam/webcam >> /var/log/webcam/webcam.log 2>&1
*/5 * * * * /home/webcam/_dev/webcam/webcam-live >> /var/log/webcam/webcam-live.log 2>&1
```

You can use this logrotate configuration to keep the log files in check if you
need.

```
# /var/logrotate.d/webcam

/var/log/webcam/webcam.log /var/log/webcam/webcam-live.log {
    daily
    rotate 7
    compress
    delaycompress
    missingok
    notifempty
    create 644 webcam webcam
}
```

You can though of course run it manually. Type `deno task` to see the available
tasks it can run. There are 4. The `build` tasks create an executable file you
can use with `cron` for ease.

### webcam.ts

1. Takes photo
2. Adds a label
3. Uploads to S3
4. Optionally created TimeLapse movie

### webcam-live.ts

1. Takes photo
2. Adds a label
3. Uploads to S3 and replaces previous

Currently running on a camera situated in the [Kyan office](https://kyan.com/)
of the development of the StMarys Wharf project.

- https://stmaryswharf-webcam.deno.dev/
- https://www.youtube.com/playlist?list=PLLNZI-dmwJyj45BKexQVYLdbpj4xv_ZnB
