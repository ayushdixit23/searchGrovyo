import React, { useEffect, useState } from "react";
import { BsWhatsapp, BsInstagram, BsLinkedin, BsYoutube } from "react-icons/bs";
import { FaSnapchatSquare } from "react-icons/fa";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon not displaying
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png'
});

const Bio = ({ bio }) => {
  const [position, setPosition] = useState(null)
  const [location, setLocation] = useState(null)


  useEffect(() => {
    if (bio) {
      if (bio?.location?.coordinates?.latitude && bio?.location?.coordinates?.longitude) {
        setPosition([bio?.location?.coordinates?.latitude, bio?.location?.coordinates?.longitude])
        setLocation(bio?.location?.streetaddress + " " + bio?.location?.city + " " + bio?.location?.state)
      }
    }
  }, [bio])


  return (
    <>

      {bio?.isAbout && (
        <div className="text-center w-full">
          {console.log(bio)}

          <div className="flex w-[100%] pn:max-sm:flex-col mt-2 justify-center space-y-1 text-center">
            <div className="sm:w-[50%] w-[100%] flex flex-col justify-start items-start">
              <div className="text-[16px] pn:max-sm:text-[14px] font-semibold">Bio:</div>
              <div className="">{bio?.bio}</div>
              {bio.showContact && <>
                <div className="text-[16px] pn:max-sm:text-[14px] font-semibold">Contact Us:</div>
                {bio?.email && !/undefined/.test(bio.email) && <div><span className="font-medium">Email :</span> {bio?.email}</div>}
                {bio?.phone && !/undefined/.test(bio.phone) && <div>

                  <span className="font-medium">Phone :</span> +{bio?.phone}</div>}

              </>}


              {Object.keys(bio?.links || {}).every(
                (key) => bio?.links[key] == "undefined"
              ) ? null : (
                <>
                  <div className="text-[16px] pn:max-sm:text-[14px] font-semibold">Links:</div>
                  <div className="flex w-full text-black items-center flex-wrap">
                    <div className="flex w-full text-black items-center flex-wrap">
                      {bio?.links.yt != "undefined" && (
                        <a
                          target="_blank"
                          href={bio?.links.yt}
                          className="flex justify-between py-2 px-5 m-2 items-center space-x-2 bg-white rounded-lg"
                        >
                          <BsYoutube className="text-red-600" />

                          <div className="text-sm font-medium">Youtube</div>
                        </a>
                      )}
                      {bio?.links?.insta != "undefined" && (
                        <a
                          target="_blank"
                          href={bio?.links?.insta}
                          className="flex justify-between py-2 px-5 m-2 items-center space-x-2 bg-white rounded-lg"
                        >
                          <BsInstagram className="text-red-600" />

                          <div className="text-sm font-medium">Instagram</div>
                        </a>
                      )}

                      {bio?.links?.x != "undefined" && (
                        <a
                          target="_blank"
                          href={bio?.links?.x}
                          className="flex justify-between py-2 px-5 m-2 items-center space-x-2 bg-white rounded-lg"
                        >
                          <BsWhatsapp className="text-green-600" />

                          <div className="text-sm font-medium">X</div>
                        </a>
                      )}
                      {bio?.links?.linkdin != "undefined" && (
                        <a
                          target="_blank"
                          href={bio?.links?.linkdin}
                          className="flex justify-between py-2 px-5 m-2 items-center space-x-2 bg-white rounded-lg"
                        >
                          <BsLinkedin className="text-blue-600 text-sm font-medium" />

                          <div className="text-sm font-medium">Linkedin</div>
                        </a>
                      )}
                      {bio?.links?.snap != "undefined" && (
                        <a
                          target="_blank"
                          href={bio?.links?.snap}
                          className="flex justify-between py-2 px-5 m-2 items-center space-x-2 bg-white rounded-lg"
                        >
                          <FaSnapchatSquare className=" text-[#FFFF00]" />

                          <div className="text-sm font-medium">Snapchat</div>
                        </a>
                      )}
                    </div>
                  </div>
                </>
              )}

            </div>
            {position && <div className="sm:w-[50%] w-[100%] sm:h-[300px] rounded-xl overflow-hidden h-[300px]">
              <MapContainer center={position} zoom={13} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={position}>
                  <Popup>
                    {location}
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
            }

          </div>
        </div >
      )}
    </>
  );
};

export default Bio;
