import { render, Component, Fragment } from 'inferno';
import { SafetyIcon, SafetyItem, Material, Access, Sign, Section, SectionOutOfOrder, SectionSafety, SectionMaterials, SectionFreeText, SectionCleanup, PaperSize, SectionMaintenance, MaintenanceItem } from './data';
import { safetyIcon2svg, safetyIcon2name, iconCleanup, ColorClass, iconAllowedMaterial, iconProhibitedMaterial } from './view_common';
import * as QRCode from 'qrcode';

const PreviewMaterial = (material: Material, allowed: boolean) => (
  <div>
    {/* <img class="invert" src={ materialIcon2svg[material.icon] || "" } /> */}
    <img class="invert" src={ allowed ? iconAllowedMaterial : iconProhibitedMaterial } />
    <p>{material.label || "Unnamed Material" }</p>
  </div>
)

const PreviewSectionGroup = ({className, name, children}: {className: string, name: string, children: any}) => (
  <div class={"sign-section " + className}>
    <h2>{name}</h2>
    {children}
  </div>
);

const PreviewSectionMaterials = ({section, useHorizontalList}: {section: SectionMaterials, useHorizontalList : boolean}) => (
  <PreviewSectionGroup
    className={`sign-materials-${section.allowed ? "allowed" : "prohibited"}`}
    name={ section.header() }>
      <div class={ useHorizontalList  ? "item-list-horizontal-small" : "item-list" }>
        {section.materials.map(item => PreviewMaterial(item, section.allowed))}
      </div>
  </PreviewSectionGroup>
);

const PreviewSectionFreeText = ({section}: {section: SectionFreeText}) => {
  return (<PreviewSectionGroup
    className="sign-quickstart"
    name={ section.header() }>
    <p>{section.contents}</p>
  </PreviewSectionGroup>);
}

const PreviewSafetyItem = (item: SafetyItem) => (
  <div>
    <img class="invert" src={ safetyIcon2svg[item.icon] || "" } />
    <p>{item.label || safetyIcon2name[item.icon] }</p>
  </div>
)

const PreviewSectionSafety = ({section}: {section: SectionSafety}) => (
  <PreviewSectionGroup
    className="sign-safety"
    name={ section.header() }>
      <div class="item-list">
        {section.icons.map(PreviewSafetyItem) }
      </div>
  </PreviewSectionGroup>
);


const PreviewCleanupItem = (item: SafetyItem) => (
  <div>
    <img class="invert" src={ iconCleanup || "" } />
    <p>{item.label || "Untitled task" }</p>
  </div>
)

const PreviewSectionMaintenance = ({section}: {section: SectionMaintenance}) => (
  <PreviewSectionGroup
    className="sign-maintenance"
    name={ section.header() }>
      <div class="item-list-rows">
        {section.rows.map(PreviewMaintenanceItem) }
      </div>
  </PreviewSectionGroup>
);


const PreviewMaintenanceItem = (item: MaintenanceItem) => (
  <div>
    <span class="label">{item.label || "No description" }</span>
    <span class="interval">{item.interval}</span>
    <span class="maintenance-label-space">Last done</span>
  </div>
)

const PreviewSectionCleanup = ({section}: {section: SectionCleanup}) => (
  <PreviewSectionGroup
    className="sign-cleanup"
    name={ section.header() }>
      <div class="item-list-horizontal-small">
        {section.items.map(PreviewCleanupItem) }
      </div>
  </PreviewSectionGroup>
);


const SignHeader = ({sign}: {sign: Sign}) => {
  const model = sign.model ? (<span id="machine-model">Model: {sign.model}</span>) : null;

  return (
    <div class={`sign-section sign-name ${ColorClass(sign)}`}>
      <h1 id="machine-name">{sign.name}</h1>
      {model}
    </div>
  );
}

const accessMessage : {[id: number]: string} = {};
accessMessage[Access.CourseRequired] = "You must complete a course to use this machine";
accessMessage[Access.UsableByEveryone] = "All members may use this machine";
accessMessage[Access.UsableByEveryoneCareful] = "You may use this machine if you know how to operate it and can do so safely";

class CourseQRCode extends Component<{ sign: Sign }, { qrData: string }> {
  state: any;
  lastQRUrl: string = null;

  constructor(props: any) {
    super(props);
    this.state = { qrData: "" };
    this.componentDidUpdate(null, null, null);
  }

  componentDidUpdate(lastProps: any, nextState: any, context: any) {
    let url = this.props.sign.courseURL.trim();
    
    if (url != this.lastQRUrl) {
      this.lastQRUrl = url;

      if (url == "") {
        this.setState({ qrData: "" });
      } else {
        const opts: any = {
          errorCorrectionLevel: 'M',
          type: 'image/png',
          margin: 1,
          color: {
            dark:"#000",
            light:"#FFF"
          }
        }

        QRCode.toDataURL(url, opts, (e, data) => {
          // Hack: required when called from constructor
          this.state.qrData = data;
          this.setState({ qrData: data });
        });
      }
    }
  }

  render() {
    if (this.state.qrData != "") {
      return (
        <div>
          <img src={ this.state.qrData } />
          <h3>Course</h3>
        </div>
      )
    }
  }
}

const SignAccess = ({sign}: {sign: Sign}) => (
  <PreviewSectionGroup className={ColorClass(sign)} name="Access">
    <div class="sign-access">
      { sign.courseURL != "" ? <CourseQRCode sign={sign} /> : null }
      <span class="sign-access-label">{accessMessage[sign.access]}</span>
    </div>
  </PreviewSectionGroup>
)

const SignOutOfOrder = ({sign}: {sign: Sign}) => {
  const reason = sign.outOfOrderReason ? (<p>{sign.outOfOrderReason}</p>) : null;
  return (
    <PreviewSectionGroup className={ColorClass(sign)} name="Status">
      <span class="sign-access-label">This machine is out of order</span>
      {reason}
      <p>See Facebook or Slack for updates</p>
      <div class="sign-outoforder-icons">
        <div>
          <img src="static/images/facebook_icon.svg" />
          <div>
            <h3>Facebook</h3>
            <p>facebook.com/groups/makerspace.se</p>
          </div>
        </div>
        <div>
          <img src="https://cdn4.iconfinder.com/data/icons/logos-and-brands/512/306_Slack_logo-512.png" />
          <div>
            <h3>Slack</h3>
            <p>#{ sign.slackChannel || "general" }</p>
          </div>
        </div>
      </div>
    </PreviewSectionGroup>
  );
 }

class PreviewSignFooter extends Component<{ sign: Sign, id: number }, { qrData: string }> {
  lastQRUrl: string = null;

  constructor(props: any) {
    super(props);
    this.state = { qrData: "" };
    this.componentDidUpdate(null, null, null);
  }

  componentDidUpdate(lastProps: any, nextState: any, context: any) {
    let url = this.props.sign.wikiURL.trim();
    if (!url) {
      url = "http://wiki.makerspace.se";
    }
    
    if (url != this.lastQRUrl) {
      this.lastQRUrl = url;

      const opts: any = {
        errorCorrectionLevel: 'M',
        type: 'image/png',
        margin: 1,
        color: {
          dark:"#000",
          light:"#FFF"
        }
      }

      console.log("URL ", url);
      QRCode.toDataURL(url, opts, (e, data) => {
        // Hack: required when called from constructor
        this.state.qrData = data;
        this.setState({ qrData: data });
      });
    }
  }

  render() {
    console.log("Q", this.state.qrData);
    return (
      <Fragment>
        <div class="sign-footer">
          <div>
            <img src={ this.state.qrData } />
            <div>
              <h3>Wiki</h3>
              <p>{ this.props.sign.wikiURL ? this.props.sign.wikiURL.replace("http://", "").replace("https://", "") : "No wiki page, you should create one!" }</p>
            </div>
          </div>
          <div class={this.props.sign.paperSize == PaperSize.A5 ? "footer-item-right" : ""}>
            <img src="https://cdn4.iconfinder.com/data/icons/logos-and-brands/512/306_Slack_logo-512.png" />
            <div>
              <h3>Slack</h3>
              <p class="pre">#{ this.props.sign.slackChannel || "general" }</p>
            </div>
          </div>
          {
            this.props.sign.paperSize == PaperSize.A4 ? (
            <div>
              <img src="static/images/zondicons/exclamation-outline.svg" />
              <div>
                <h3>Changes needed?</h3>
                <p class="pre">Update this sign at<br/>sign.arongranberg.com/{this.props.id}</p>
              </div>
            </div>)
            : null
          }
        </div>
        {
          this.props.sign.paperSize == PaperSize.A5 ? (
            <div class="sign-footer-tiny">
              <p>Changes needed? Update this sign at sign.arongranberg.com/{this.props.id}</p>
            </div>
          ) : null
        }
      </Fragment>
    );
  }
}

function PreviewSection(section: Section, useHorizontalList: boolean) : JSX.Element {
  if (!section.enabled) return;

  if (section instanceof SectionMaterials) return PreviewSectionMaterials({ section, useHorizontalList });
  else if (section instanceof SectionFreeText) return PreviewSectionFreeText({ section });
  //else if (section instanceof SectionOutOfOrder) return PreviewSectionOutOfOrder({ section });
  else if (section instanceof SectionSafety) return PreviewSectionSafety({ section });
  else if (section instanceof SectionMaintenance) return PreviewSectionMaintenance({ section });
  else if (section instanceof SectionCleanup) return PreviewSectionCleanup({ section });
  else throw new Error("Unexpected section type " + typeof(section));
}

export const PreviewSign = ({ sign, id }: { sign: Sign, id: number }) => {
  if (sign.outOfOrder) {
    return (
      <div class="sign-root">
        <SignHeader sign={sign} />
        <SignOutOfOrder sign={sign} />
        <PreviewSignFooter sign={sign} id={id} />
      </div>
    );
  }

  const sections = sign.sections;
  let useHorizontalList = Math.max((sections.prohibitedMaterials.enabled ? sections.prohibitedMaterials.materials.length : 0), (sections.allowedMaterials.enabled ? sections.allowedMaterials.materials.length : 0)) > 4;
  useHorizontalList = useHorizontalList || (sections.prohibitedMaterials.enabled && sections.prohibitedMaterials.materials.some(v => v.label.length > 22));
  useHorizontalList = useHorizontalList || (sections.allowedMaterials.enabled && sections.allowedMaterials.materials.some(v => v.label.length > 22));

  const arr = [
    sections.safety,
    sections.allowedMaterials,
    sections.prohibitedMaterials,
    sections.quickStart,
    sections.cleanup,
    sections.maintenance,
  ];
  return (
    <div class={"sign-root " + (sign.paperSize == PaperSize.A4 ? "a4" : "a5")}>
      <SignHeader sign={sign} />
      <SignAccess sign={sign} />
      {arr.map(section => PreviewSection(section, useHorizontalList))}
      <PreviewSignFooter sign={sign} id={id} />
    </div>
  );
};
