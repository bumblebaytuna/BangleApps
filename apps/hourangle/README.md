## Purpose
This app helps align your camera star-tracker or telescope equatorial mount with the northern Pole Star (also known as Polaris). Correct alignment prevents sky objects drifting out of view and/or smearing during long-exposure photographs.

## Background
Due to the Earth's rotation the sky looks to us like it rotates around an imaginary point known as the celestial pole. Each rotation takes slightly less than a day.

Many astronomers and astrophotgraphers rely on using a telescope mount called an equatorial mount. It has to be accurately aligned with the celestial pole, the powered drive inside it (which can be anything from clockwork to electric) then follows the daily rotation of the sky. This makes it look to the observer/photographer looking through a telescope or camera like the sky is still. It stops objects drifting out of view, and/or long-exposure photographs smearing. More recently we have seen the arrival of highly portable mini-equatorial mounts called star-trackers for people who like taking nightscape photos with DSLR cameras. These also rely on getting the polar alignment as accurate as possible. The more accurate the alignment, the longer the exposure that can be taken. 

Common wisdom is that the northern Pole Star (Polaris) marks the celestial pole. In reality it does not, it is close, but slightly offset from it. This means due to the Earth's rotation it also does a full rotation around this imaginary celestial pole in slightly less than a day. Due to the natural movement of stars over many years it is also very slowly moving away from the pole all the time. 

This app mimics Polaris’s position around the celestial pole at the current time and date. It resembles a clock-face. Equatorial mounts and some star trackers are fitted with a similar clock-face device called a polarscope. The exact alignment procedure depends on the telescope or star-tracker brand, but the aim is to get the position of Polaris on the polar-scope's clock face to match the position on the app's clockface.

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

The exact alignment procedure depends on the telescope or star-tracker brand, but the goal is to match the polar-scope view of Polaris to that on the app. Note this app is designed for Northern Hemisphere use only
- If you get stuck at any point during this initial setup procedure, familiarise yourself with the app's menu structure shown below.

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

**Preparation**
- First ensure you know
  
    - The longitude of your observing location (in degrees, and whether it is East or West)
    - The validity years of your mount/star-tracker's polarscope. Typically 20-30 years, and is normally written/etched onto the polarscope view. If you do not know the validity years then don't worry, just make a rough estimate based on the age of your mount/star-tracker.

**App setup**
- Then go into the Bangle.js 2 launcher > Hour Angle.
- It will show the first menu and give you a choice of Run, Settings, or Exit.
- Choose Settings, and adjust the settings described below
  
  - **Settings > Longitude**: Set your location's longitude. The angle is to a resolution of the nearest degree. Just round your location's longitude to the nearest degree and the position error on the Bangle.js 2 display will be less than a pixel wide (i.e not noticeable). The default setting is 0 degrees West.
  - **Settings > Start Year**: Set the starting validity year of your polarscope. The default setting is the year 2000.
  - **Settings > End Year**: Set the starting validity year of your polarscope. The default setting is the year 2030.
  - **Settings > Style**: Choose a clock-face style to display. The app currently comes with two clock-faces. Style 1 is similar to polarscopes found in Takahashi, Orion, and Skywatcher equatorial mounts and camera star-trackers. Style 2 is similar to the polarscope for a Move-Shoot-Move camera star-tracker.
- All of your parameters will be saved in the watch.
- You only need to adjust the longitude value if you significantly change location. You only need to adjust the validity years if you buy a new mount or polarscope.
- There is also a Reset option in the menu. This will set all parameters back to their default settings.

**Using the App outside**
- Ensure your Bangle watch time is correct. Do not worry if your watch is set to a different time zone, the app only uses the watch's UTC time signal.
- Ensure your polarscope is correctly fitted and calibrated to your mount/star-tracker
- Start the app and choose Run. It will draw the clockface and Polaris' position based on your settings
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


## Future Development

- I designed this app many years ago and have ported it to various devices. It reliably does the job for which it was intended and I regularly use it myself.
- If you spot a bug please raise a request via the BangleApps issues
- I'm happy to consider adding extra polarscope clockface styles, just ask via BangleApps
- Use of the watch's GPS to automatically collect your current longitude and time has been developed and is undergoing field testing. I am unsure yet if it is a feature really worth having due to the time it takes to get a GPS fix, whereas manual location input is reliable and gives instant results. I would rather this app is known for being reliable and bullet-proof, there are already enough things that can go wrong when doing astronomy/astrophotography.
- Because I have limited time and resources I will not be extending the app to cover the following areas, so please don't waste time asking. i) Southern Hemisphere polar alignment (I think it unlikely practical or useful on a watch display this small), ii) I can't guarantee it working on a Bangle.js 1 except the Espruino WEB IDE emulator, use it at your own risk. iii) Reliance on a data connection to a mobile phone. The whole point is for it to be standalone, compact, and reliable.

## References

- Algorithms from 'Astronomical Algorithms 2nd Edition, Jean Meeus'
