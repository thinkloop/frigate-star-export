# Frigate Star Export Node.js Script

## Overview

With the 0.14 release of Frigate, a breaking change means that favorited events will be lost. 
The release notes recommend exporting any starred/favorite events before upgrading. 
This script automates that process.

## How It Works
The Node.js script loads all your starred videos and triggers an export for each one. 
Exported files will appear in your regular exports folder. 
To avoid system overload, a pause is applied after each export based on the video’s length.

Frigate’s export process is asynchronous, so errors will go unreported. 
Monitor your logs and compare the number of exported files to the number of triggered exports to identify any missing files. 

## Usage
Clone the repository and run the main file:

```bash
git clone git@github.com:thinkloop/frigate-star-export.git
cd frigate-star-export
node ./frigate-star-export.js
```

## License
This project is licensed under the MIT License. See the LICENSE file for details.