# Installation
* Copy the entire repository to a folder
* `http://cognition-srv1.ouc.ac.cy/prudens/` should be pointing to `index.html`.
* In `research.html`, line 53, change the following part: `onclick="window.location='index.html'"` so as to point to 
the current content of [http://cognition-srv1.ouc.ac.cy/prudens/](http://cognition-srv1.ouc.ac.cy/prudens/).

## Reminder
* You need to exclude any cells from the context that may contain mines! Actually, you shall make them 0 as well, so as to hide them from the user. The same applies, in general, to any non-visible cell (false in the VISIBLE array). So, you label with -1 any invisible cells and with their label, if any, any visible ones, with 0 meaning that a cell is **visible** and **empty**.
