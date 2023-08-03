import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import PageHeader from "../components/layouts/PageHeader";
import { getCreator } from "../utils/api";
import Avatar from "../components/layouts/Avatar";
import FollowButton from "../components/button/FollowButton";
import { searchCollections } from "../redux/state/search";
import CollectionItemsList from "../components/layouts/collections/CollectionItemsList";
import ToastPopup from "../components/utils/ToastPopup";
import { useTitle } from "../components/utils/TitleProvider";
import Skeleton from "react-loading-skeleton";

const Creator = () => {
  const [menuTab] = useState([
    {
      class: "active",
      name: "COLLECTIONS",
    },
  ]);
  const [panelTab] = useState([
    {
      id: 1,
      dataContent: [],
    },
  ]);

  const dispatch = useDispatch();
  const params = useParams();
  const navigate = useNavigate();
  const { setTitle } = useTitle();

  const [creator, setCreator] = useState();
  const [count, setCount] = useState(0);
  const [pages, setPages] = useState(1);

  useEffect(() => {
    if (creator) {
      dispatch(searchCollections({ creator: creator._id }));
    }
  }, [creator]);

  useEffect(() => {
    if (params.id) {
      getCreator(params.id)
        .then((res) => {
          if (!res.data.creator.display_name) {
            ToastPopup("Unable to find creator", "error");
            navigate("/");
          }
          setCreator(res.data.creator);
          setTitle(res.data.creator.display_name + " - Creator");
        })
        .catch(() => {
          ToastPopup("Unable to find creator", "error");
          navigate("/");
        });
    }
  }, []);

  return (
    <div className="authors-2">
      <Header />
      <PageHeader />
      <section className="tf-section authors">
        <div className="themesflat-container">
          <div className="flat-tabs tab-authors">
            <div className="author-profile flex">
              <div className="feature-profile">
                {creator ? (
                  <Avatar creator={creator} size={300} />
                ) : (
                  <Skeleton
                    height="275px"
                    width="275px"
                    borderRadius="21px"
                    containerClassName="avatar"
                  />
                )}
              </div>
              <div className="info-profile">
                <span>Creator Profile</span>
                <h2 className="title">{creator?.display_name ?? "Unknown"}</h2>
                <p className="content">{creator?.bio ?? "Unknown"}</p>
                <form>
                  <input
                    type="text"
                    className="inputcopy"
                    defaultValue="DdzFFzCqrhshMSxABCdfrge"
                    readOnly
                  />
                  <button type="button" className="btn-copycode">
                    <i className="icon-fl-file-1"></i>
                  </button>
                </form>
              </div>
              <div className="widget-social style-3">
                <ul>
                  <li>
                    <Link to="#">
                      <i className="fab fa-twitter"></i>
                    </Link>
                  </li>
                  <li className="style-2">
                    <Link to="#">
                      <i className="fab fa-telegram-plane"></i>
                    </Link>
                  </li>
                  <li>
                    <Link to="#">
                      <i className="fab fa-youtube"></i>
                    </Link>
                  </li>
                  <li className="mgr-none">
                    <Link to="#">
                      <i className="icon-fl-tik-tok-2"></i>
                    </Link>
                  </li>
                </ul>
                <div className="btn-profile">
                  <FollowButton creator={creator} />
                </div>
              </div>
            </div>
            <Tabs>
              <TabList>
                {menuTab.map((item, index) => (
                  <Tab key={index}>{item.name}</Tab>
                ))}
              </TabList>

              {panelTab.map((item) => (
                <TabPanel key={item.id}>
                  <CollectionItemsList
                    layout={false}
                    setCount={setCount}
                    setPages={setPages}
                  />
                </TabPanel>
              ))}
            </Tabs>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Creator;
