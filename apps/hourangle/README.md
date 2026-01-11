## Purpose
This app helps align your camera star-tracker or telescope equatorial mount with the northern Pole Star (also known as Polaris). Correct alignment prevents sky objects drifting out of view and/or smearing during long-exposure photographs.

## Background
Due to the Earth's daily rotation the sky appears to rotate around an imaginary point known as the celestial pole. 

Many astronomers and astrophotgraphers rely on using a telescope mount called an equatorial mount. It has to be accurately aligned with the celestial pole, and then a powered drive inside it (which can be anything from clockwork to electric) follows the daily rotation of the sky. This makes it look to the observer/photographer looking through the telescope or camera like the sky is still. It stops objects drifting out of view, and/or long-exposure photographs smearing. More recently we have seen the arrival of portable mini equatorial mounts called star-trackers for people who like taking nightscape photos with DSLR cameras. These also rely on getting their polar alignment as accurate as possible. 

Common wisdom is that the northern Pole Star (Polaris) marks the celestial pole. In reality it is not, it is close, but slightly offset from it. This means it also does a full rotation around the celestial pole every day. Due to natural star movment it is also slowly moving away from the pole every year. 

This app mimics Polaris’s position around the celestial pole at the current time and date. It resembles a clock-face but a full rotation represents **24 hours rather than 12**, corresponding to one daily rotation of Polaris around the Pole. Equatorial mounts and some star trackers are also fitted with a similar clock-face device called a polarscope. The exact alignment procedure depends on the telescope or star-tracker brand, but the aim is to get the position of Polaris on the polar-scope's clock face to match the position on the app's clockface.

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/bumblebaytuna/BangleApps/blob/master/apps/hourangle/images/Display_Style_01.png">
        <img src="https://github.com/bumblebaytuna/BangleApps/blob/master/apps/hourangle/images/Display_Style_01.png" width="200">
      </a><br>
      <em>Figure 1. Polarscope Display Style 1</em>
    </td>
    <td align="center">
      <a href="https://github.com/bumblebaytuna/BangleApps/blob/master/apps/hourangle/images/Display_Style_02.png">
        <img src="https://github.com/bumblebaytuna/BangleApps/blob/master/apps/hourangle/images/Display_Style_02.png" width="200">
      </a><br>
      <em>Figure 2. Polarscope Display Style 2</em>
    </td>
  </tr>
</table>

## Setup

The exact alignment procedure depends on the telescope or star-tracker brand, but the goal is to match the polar-scope view of Polaris to that on the app.

- Note this app is designed for Northern Hemisphere use only
- Go into Bangle.js 2 > Polaris Hour Angle.
- The first menu gives you achoice of Run or Settings. Choose Settings 
- Set your location's longitude, both the angle (in degrees) and whether it is East or West. The angle is to a resolution of the nearest degree. Just round your location's longitude to the nearest degree and the position error on the Bangle.js 2 display will be less than a pixel wide (i.e not noticeable).
- Set the validity years of your polarscope. It is typically a 20-30 year period and normally written/etched into the polarscope view. If you do not know the validity years then don't worry, just make a rough estimate based on the age of the mount/star-tracker.
- Set the clock-face style to display. The app currently comes with two clock-faces. Style 1 is similar to polarscopes found in Takahashi, Orion, and Skywatcher equatorial mounts and camera star-trackers. Style 2 is similar to the polarscope for a Move Shoot Move camera star-tracker.
- Ensure your Bangle watch time is correct. Do not worry if your watch is set to a different time zone, the app only uses the watch's UTC time signal.
- Ensure your polarscope is correctly fitted and calibrated to your mount/star-tracker
- Restart the app and choose Run. It will draw the clockface and Polaris' position based on your parameters above
- Match your polar-scope view of Polaris to that on the app

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/bumblebaytuna/BangleApps/blob/master/apps/hourangle/images/Alignment_using_the_app.png">
        <img src="https://github.com/bumblebaytuna/BangleApps/blob/master/apps/hourangle/images/Alignment_using_the_app.png" width="500">
      </a><br>
      <em>Figure 3. Telescope/tracker Alignment Using the App</em>
    </td>
  </tr>
</table>

- All of your parameters will be saved in the watch. Just change the longitude value if you move location.
- There is also a Reset option in the menu. This will set all parameters back to their default settings.

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/bumblebaytuna/BangleApps/blob/master/apps/hourangle/images/Menu_Structure.png">
        <img src="https://github.com/bumblebaytuna/BangleApps/blob/master/apps/hourangle/images/Menu_Structure.png" width="500">
      </a><br>
      <em>Figure 4. Menu Structure in the App (Click to Expand) </em>
    </td>
  </tr>
</table>

## Future Development

- This app reliably does the job for which it was intended and I use it myself
- If you find a bug please raise a request via the BangleApps issues
- I'm happy to consider adding extra polarscope clockface styles, just ask via BangleApps
- Use of the watch's GPS to automatically collect your current longitude and time has been developed and is undergoing field testing. I am unsure yet whether it is really a worthwhile feature to have due to the long time taken for the watch to get a GPS fix (whereas manual input of your location in the settings is reliable and gives instant results).
- Because I have limited time and resources I will not be extending the app to cover the following areas, so please don't waste time asking. i) Southern Hemisphere polar alignment (I think it unlikely practical or useful on a watch display this small), ii) For use on a Bangle.js 1, iii) Reliance on a connection to a mobile phone, the whole point is for it to be reliable, standalone, and compact.
