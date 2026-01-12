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
- Ensure your Bangle watch time is correct. Don't worry if you are in a different time zone, the app only uses the watch's UTC time signal.
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

- I designed this app many years ago and have ported it to various devices. It reliably does the job for which it was intended and I regularly use it myself. If you spot a bug please raise a request via the BangleApps issues
- **Extra Polarscope Clock-face Styles**. Happy to consider adding them, just ask via BangleApps
- **Use of GPS**. Using the watch GPS to automatically collect the current longitude and time has been developed as part of this app and is undergoing field testing. I am unsure yet if it is a feature worth having due to the time it takes and the reliability of getting a GPS fix. Manual location input is reliable and gives instant results. I would rather this app is known for being reliable and bullet-proof, there are already enough things that can go wrong when doing astronomy/astrophotography.
- **Night-Vision Mode**. I know this is a subject charged with lots of opinion and emotion. My view is you have to balance getting perfect night vision with the practicality of seeing what you are doing. Yes, assuming the same light intensity, red colour does have the least effect on night-vision, but practically it is also one of the most difficult colours to read. This app needs to be usable by people with non-perfect eyesight, which constitutes the majority of astronomers and astrophotographers except the youngest. For this reason I will never be developing a pure red night-vision mode. If the future Bangle.js 3 is produced as planned with a higher colour-depth display then I will consider adding a night-vision mode which mixes in a little green light with the red light (e.g an orange mode) which will make it much easier to read. I can't at present do that properly with the Bangle.js 2 display's colour-depth. The app already works when the watch is in dark mode, and because it is on such a small device it is easily to shield if concerned it may cause a light nuisance to others. If you need the watch generally darker for your own night-vision then its not an issue specific to this app, change to dark mode and reduce the display brightness in the main watch settings (Launcher > Settings > LCD > Brightness. Mine stays permanently on dark mode and brightness 1 for both day and night use).

## Limitations

- Because I have limited time and resources I will never be extending the app to cover the following features, please don't waste time asking for them.
  
  - **Southern Hemisphere polar alignment**. I think it unlikely practical or useful on a watch display this small, sorry
    
  - **Support for Bangle.js 1**. It doesn't have enough memory to run the app.
  
  - **Reliance on a data connection to another device (e.g. mobile phone)**. This feature will never be offered, the design philosophy of this app is for it to be simple, reliable, and standalone/off-grid.

## References

- Algorithms from 'Astronomical Algorithms 2nd Edition, Jean Meeus'
