# Polaris Hour Angle

## Purpose
This app helps align your camera star-tracker or telescope equatorial mount with the Pole Star. Correct alignment prevents the viewed object from drifting out of view or smearing during long-exposure photographs.

## Background
The Pole Star (Polaris) is not in a fixed position. It completes one rotation around the true Galactic Pole every day and slowly moves away from the Galactic Pole over time.

This app mimics Polaris’s changing position as seen through a mount or star-tracker polar alignment scope.

## Pictures

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/bumblebaytuna/BangleApps/blob/master/apps/hourangle/images/Display%20Style%201.png">
        <img src="https://github.com/bumblebaytuna/BangleApps/blob/master/apps/hourangle/images/Display%20Style%201.png" width="200">
      </a><br>
      <em>Figure 1. Polarscope Display Style 1</em>
    </td>
    <td align="center">
      <a href="https://github.com/bumblebaytuna/BangleApps/blob/master/apps/hourangle/images/Display%20Style%202.png">
        <img src="https://github.com/bumblebaytuna/BangleApps/blob/master/apps/hourangle/images/Display%20Style%202.png" width="200">
      </a><br>
      <em>Figure 2. Polarscope Display Style 2</em>
    </td>
  </tr>
</table>

## Usage

The display is designed for Northern Hemisphere use only

The display resembles a clock face but represents **24 hours rather than 12 hours**, corresponding to one full daily rotation of Polaris around the Galactic Pole.

Polar scopes typically include two rings and a validity period (for example, year 2000 to 2030):

- The **outer ring** represents the later date (e.g. 2030)
- The **inner ring** represents the earlier date (e.g. 2000)

The app calculates:
- Its correct clock-face position during the daily rotation
- How far Polaris should be positioned between inner and outer ring. 

The exact alignment procedure depends on the telescope or star-tracker brand, but the goal is for the polar-scope view to match the display shown in the app. The app setup procedure is as follows.

- Go into Bangle.js 2 > Settings > Apps > Hour Angle. 
- Put in your location's longitude. This is deliberately kept simple, to a resolution of the nearest degree. This is because if you round your location's longitude to the nearest degree, the error on the Bangle.js 2 display will be less than a pixel wide.
- Put in the validity years of your polarscope, typically a 20-30 year period and normally written/etched onto the polarscope glass. The default is set to 2000 to 2030. If you do not know the validity years then don't worry, it makes such a small position refinement and is not essential unless you are doing high-magnification viewing or high-resolution imaging. If you are using a digital camera star-tracker or doing visual telescope observing then just take a rough stab at the validity years.
- The app comes with two clockface styles. Style 1 is similar to polarscopes found in Takahashi, Orion, and Skywatcher equatorial mounts and camera star-trackers. Style 2 is similar to the polarscope found on a Move Shoot Move camera star-tracker.
- Ensure your Watch time is correct. The app uses the watch's UTC time so do not worry if your watch is set to a different time zone.
- Restart the app and it will draw the clockface and Polaris position based on your parameters

## Future Development

- This app reliably does the job for which it was intended and I use it myself regularly.
- If you find any bugs just raise a request via BangleApps issues
- I have limited time and resources to expand its capabilities, but this should not stop others developing a more capable fork if they wish to.
- Happy to consider adding in extra polarscope display styles, just ask
- Use of the watch's GPS to automatically collect your current latitude and time has been developed and is undergoing field testing. Weather windows for astronomy can be short and I am unsure yet whether it is really a worthwhile capability to have due to the time needed to get a GPS fix (whereas manual input of your location in the settings is reliable and gives instant results).
  
- I will never be expanding the app in the following area(s). If someone wishes to expand it for use in these areas then please by all means do so.
  i) Southern Hemisphere polar alignment (I think it unlikely of much use for a watch display this small)
  ii) For use on an Bangle.js 1
