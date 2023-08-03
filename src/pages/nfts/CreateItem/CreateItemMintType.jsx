import { Field } from "redux-form";
import { useSelector } from "react-redux";
import { renderFormV2 } from "../../../utils/form";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { mystToSui } from "../../../utils/formats";
import Tooltip from "../../../components/utils/Tooltip";

const CreateItemMintType = ({
  setTab,
  tab,
  setMintType,
  collection,
  launchpad,
  collectionLaunchpads,
}) => {
  const settings = useSelector((state) => state.settings);
  const user = useSelector((state) => state.user);
  const tiers = [0]; //placeholder

  return (
    <Tabs onSelect={setMintType}>
      <TabList className="react-tabs__tab-list two-tabs">
        <Tab>
          <span className="icon-fl-tag"></span>Mint and List Immediately
        </Tab>
        <Tab>
          <span className="icon-fl-send"></span>Mint Only
        </Tab>
      </TabList>
      <TabPanel>
        <Tabs selectedIndex={tab} onSelect={setTab}>
          <TabList>
            <Tab>
              <span className="icon-fl-tag"></span>Fixed Price
            </Tab>
            <Tab>
              <span className="icon-fl-clock"></span>Time Auctions
            </Tab>
            <Tab>
              <span className="icon-fl-clock"></span>Add To Mintpad
            </Tab>
          </TabList>
          <TabPanel>
            <Field
              type="number"
              name="price"
              placeholder="Enter price for one NFT (SUI)"
              props={{
                min: mystToSui(settings.min_bid_increment).toString(),
                step: "any",
              }}
              required
              component={renderFormV2}
            />
          </TabPanel>
          <TabPanel>
            <Field
              type="number"
              name="price"
              title="Minimum bid"
              placeholder="Enter minimum bid"
              props={{
                min: mystToSui(settings.min_bid_increment).toString(),
                step: "any",
              }}
              required
              component={renderFormV2}
            />
            <Field
              type="number"
              name="min_bid_increment"
              title="Minimum bid Increment"
              placeholder="Enter minimum bid"
              props={{
                step: "any",
              }}
              required
              appendTitle={
                <Tooltip>
                  <p>
                    The minimum amount each bid must increase by, e.g. if the current bid
                    is 1 SUI and the bid increment is 0.1, the next bid must be &ge; 1.1
                    Sui.
                  </p>
                  <a data-tip data-for="lockedTier">
                    <i className="fas fa-info-circle" />
                  </a>
                </Tooltip>
              }
              component={renderFormV2}
            />
            <div className="row">
              <div className="col-md-6">
                <Field
                  type="datetime-local"
                  name="starts"
                  title="Starting date"
                  required
                  props={{ min: "2022-01-01 00:00" }}
                  component={renderFormV2}
                />
              </div>
              <div className="col-md-6">
                <Field
                  type="datetime-local"
                  name="expires"
                  title="Expiration date"
                  required
                  component={renderFormV2}
                />
              </div>
            </div>
          </TabPanel>
          <TabPanel>
            {!!collection && (
              <Field
                type="select"
                name="launchpad"
                title="Mintpad"
                required={true}
                disabled={collectionLaunchpads.length === 0}
                component={renderFormV2}
              >
                <option key="placeholder" value="" hidden>
                  {collectionLaunchpads.length > 0
                    ? "Select a mintpad"
                    : "No mintpads available for collection"}
                </option>
                {collectionLaunchpads.map((col, index) => (
                  <option key={col._id} value={index}>
                    {col.launchpad_collection.name}
                  </option>
                ))}
              </Field>
            )}
            {!!launchpad && (
              <Field type="select" name="tier" required={true} component={renderFormV2}>
                <option key="placeholder" value="" hidden>
                  Select a tier
                </option>
                {tiers.map((tier) => (
                  <option key={tier} value={tier}>
                    {tier}
                  </option>
                ))}
              </Field>
            )}
          </TabPanel>
        </Tabs>
      </TabPanel>
      <TabPanel>
        <Field
          type="text"
          name="recipient"
          component={renderFormV2}
          placeholder={user.account_address}
        />
      </TabPanel>
    </Tabs>
  );
};

export default CreateItemMintType;
