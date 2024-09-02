# Frigate Star Export Node.js Script

## Overview

The 0.14 release of Frigate introduces a breaking change that will result in the loss of starred/favorited events. 
The release notes advise exporting these events before upgrading. 
This script automates that process.

## How It Works

The Node.js script prompts for a Frigate URL, loads all starred videos, and exports them one by one, pausing in between each based on the video's length. 
Exported files appear in the regular exports folder.

Since the export process is asynchronous, some errors may go unreported. 
Monitor your logs and compare the number of exported files to the number of triggered exports to identify any missing files.

## Usage

Download the file and run it:

```bash
git clone git@github.com:thinkloop/frigate-star-export.git
cd frigate-star-export
node ./frigate-star-export.js
```

## License

This project is licensed under the MIT License. See the LICENSE file for details.