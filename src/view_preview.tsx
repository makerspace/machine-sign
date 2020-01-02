import { render, Component } from 'inferno';
import { SafetyIcon, MaterialIcon, Material, Access, Sign, Section, SectionOutOfOrder, SectionSafety, SectionMaterials, SectionFreeText } from './data';
import { materialIcon2svg, ColorClass } from './view_common';

const PreviewMaterial = (material: Material) => (
  <div>
    <img class="invert" src={ materialIcon2svg[material.icon] || "" } />
    <p>{material.label || MaterialIcon[material.icon] }</p>
  </div>
)

const PreviewSectionGroup = ({className, name, children}: {className: string, name: string, children: any}) => (
  <div class={"sign-section " + className}>
    <h2>{name}</h2>
    {children}
  </div>
);

const PreviewSectionMaterials = ({section}: {section: SectionMaterials}) => (
  <PreviewSectionGroup
    className={`sign-materials-${section.allowed ? "allowed" : "prohibited"}`}
    name={ section.header() }>
      <div class="item-list">
        {section.materials.map(PreviewMaterial)}
      </div>
  </PreviewSectionGroup>
);

const PreviewSectionFreeText = ({section}: {section: SectionFreeText}) => {
  return (<PreviewSectionGroup
    className="sign-quickstart"
    name={ section.header() }>
    {section.contents}
  </PreviewSectionGroup>);
}

const PreviewSectionSafety = ({section}: {section: SectionSafety}) => (
  <h1>Hi</h1>
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
accessMessage[Access.UsableByEveryoneCareful] = "All members may use this machine if it can be done in a safe way";

const SignAccess = ({sign}: {sign: Sign}) => (
  <PreviewSectionGroup className={ColorClass(sign)} name="Access">
    <span class="sign-access-label">{accessMessage[sign.access]}</span>
  </PreviewSectionGroup>
)

const SignOutOfOrder = ({sign}: {sign: Sign}) => {
  const reason = sign.outOfOrderReason ? (<p>{sign.outOfOrderReason}</p>) : null;
  return (
    <PreviewSectionGroup className={ColorClass(sign)} name="Status">
      <span class="sign-access-label">This machine is out of order</span>
      {reason}
      <p>See Slack or Facebook for updates</p>
    </PreviewSectionGroup>
  );
 }

const PreviewSignFooter = ({sign}: {sign: Sign}) => (
  <div class="sign-footer">
    <div>
      <img class="" src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/QR_code_for_mobile_English_Wikipedia.svg/1200px-QR_code_for_mobile_English_Wikipedia.svg.png" />
      <div>
        <h3>Wiki</h3>
        <p>http://mkrspc.se/?342</p>
      </div>
    </div>
    <div>
      <img src="https://cdn4.iconfinder.com/data/icons/logos-and-brands/512/306_Slack_logo-512.png" />
      <div>
        <h3>Slack</h3>
        <p>#cnc</p>
      </div>
    </div>
    <div>
      <img class="" src="images/zondicons/exclamation-outline.svg" />
      <div>
        <h3>Changes needed?</h3>
        <p>Update this sign at medlem.makerspace.se/sign/404</p>
      </div>
    </div>
  </div>
);

function PreviewSection(section: Section) : JSX.Element {
  if (!section.enabled) return;

  if (section instanceof SectionMaterials) return PreviewSectionMaterials({ section });
  else if (section instanceof SectionFreeText) return PreviewSectionFreeText({ section });
  //else if (section instanceof SectionOutOfOrder) return PreviewSectionOutOfOrder({ section });
  else if (section instanceof SectionSafety) return PreviewSectionSafety({ section });
  else throw new Error("Unexpected section type " + typeof(section));
}

export const PreviewSign = ({ sign }: { sign: Sign }) => {
  if (sign.outOfOrder) {
    return (
      <div class="sign-root">
        <SignHeader sign={sign} />
        <SignOutOfOrder sign={sign} />
        <PreviewSignFooter sign={sign} />
      </div>
    );
  }

  const sections = sign.sections;
  const arr = [
    sections.allowedMaterials,
    sections.prohibitedMaterials,
    sections.quickStart
  ];
  return (<div class="sign-root">
    <SignHeader sign={sign} />
    <SignAccess sign={sign} />
    {arr.map(PreviewSection)}
    <PreviewSignFooter sign={sign} />
  </div>);
};
