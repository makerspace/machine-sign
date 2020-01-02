import { render, Component } from 'inferno';
import { SafetyIcon, MaterialIcon, Material, Access, Sign, Section, SectionOutOfOrder, SectionSafety, SectionMaterials, SectionFreeText, SafetyItem } from './data';
import { materialIcon2svg, ColorClass } from './view_common';

type OnChange = () => void;
type OnChangeBool = (value: boolean) => void;


function dirty() {

}

const SettingsSectionGroup = ({name, children, enabled = true, onChangeEnabled }: {name: string, children: any, enabled?: boolean, onChangeEnabled?: OnChangeBool}) => {
    const enable = onChangeEnabled ? (<input type="checkbox" name="enabled"  checked={enabled} onInput={(e: Event) => onChangeEnabled((e.target as HTMLInputElement).checked) } />) : null;
    return (
        <div class="sign-section">
            <div class="settings-section-header">
                { enable }
                <h2>{name}</h2>
            </div>
            { enabled ? children : null }
        </div>
    );
}

const SettingsMaterial = ({material, onChange} : {material: Material, onChange: OnChange}) => {
    const materialIcons = Object.keys(MaterialIcon).map((k: any) => MaterialIcon[k] as any).filter(k => typeof k === "number") as number[];

    return (
        <div>
            <select value={material.icon} onInput={ (e: Event) => { material.icon = Number((e.target as HTMLSelectElement).value) as MaterialIcon; onChange(); }}>
                { materialIcons.map(v => (<option value={v}>{MaterialIcon[v]}</option>))  }
            </select>
            <input type="text" placeholder={MaterialIcon[material.icon]} onInput={(e: Event) => { material.label = (e.target as HTMLInputElement).value; onChange(); }} />
        </div>
    );
};

const SettingsSectionMaterials = ({section, onChange}: {section: SectionMaterials, onChange: OnChange}) => (
    <SettingsSectionGroup name={section.defaultHeader()} enabled={section.enabled} onChangeEnabled={v => { section.enabled = v; onChange(); }} >
        { section.materials.map(v => SettingsMaterial({material: v, onChange})) }
        <button onClick={ () => { section.materials.push(new Material(MaterialIcon.SafetyGlasses)); onChange(); }}>Add material</button>
    </SettingsSectionGroup>
);

const SettingsSectionFreeText = ({section, onChange}: {section: SectionFreeText, onChange: OnChange}) => {
  return (<SettingsSectionGroup
    enabled={section.enabled}
    name={ section.header() }
    onChangeEnabled={v => { section.enabled = v; onChange(); }} >
    {section.contents}
  </SettingsSectionGroup>);
}

const SettingsSafetyItem = ({item, onChange} : {item: SafetyItem, onChange: OnChange}) => {
    const safetyIcons = Object.keys(SafetyIcon).map((k: any) => SafetyIcon[k] as any).filter(k => typeof k === "number") as number[];

    return (
        <div>
            <select value={item.icon} onInput={ (e: Event) => { item.icon = Number((e.target as HTMLSelectElement).value) as SafetyIcon; onChange(); }}>
                { safetyIcons.map(v => (<option value={v}>{SafetyIcon[v]}</option>))  }
            </select>
            <input type="text" placeholder={SafetyIcon[item.icon]} onInput={(e: Event) => { item.label = (e.target as HTMLInputElement).value; onChange(); }} />
        </div>
    );
};

const SettingsSectionSafety = ({section, onChange}: {section: SectionSafety, onChange: OnChange}) => (
    <SettingsSectionGroup name={section.defaultHeader()} enabled={section.enabled} onChangeEnabled={v => { section.enabled = v; onChange(); }} >
        { section.icons.map(item => SettingsSafetyItem({item, onChange})) }
        <button onClick={ () => { section.icons.push(new SafetyItem(SafetyIcon.SafetyGlasses)); onChange(); }}>Add safety</button>
    </SettingsSectionGroup>
);




const accessMessage : {[id: number]: string} = {};
accessMessage[Access.CourseRequired] = "You must complete a course to use this machine";
accessMessage[Access.UsableByEveryone] = "All members may use this machine";
accessMessage[Access.UsableByEveryoneCareful] = "All members may use this machine if it can be done in a safe way";

const SignHeader = ({sign, onChange}: {sign: Sign, onChange: OnChange}) => {
  const model = sign.model ? (<span id="machine-model">Model: {sign.model}</span>) : null;
  const accessLevels = Object.keys(Access).map((k: any) => Access[k] as any).filter(k => typeof k === "number") as number[];

  return (<SettingsSectionGroup name="Machine">
    <input type="text" placeholder="Machine name" onInput={(e:Event) => { sign.name = (e.target as HTMLInputElement).value; onChange(); }} />
    <input type="text" placeholder="Machine model" onInput={(e:Event) => { sign.model = (e.target as HTMLInputElement).value; onChange(); }} />
    <select value={sign.access} onInput={ (e: Event) => { sign.access = Number((e.target as HTMLSelectElement).value) as Access; onChange(); }}>
        { accessLevels.map(v => (<option value={v}>{accessMessage[v]}</option>))  }
    </select>
  </SettingsSectionGroup>);
}


const SignOutOfOrder = ({sign, onChange}: {sign: Sign, onChange: OnChange}) => (
    <SettingsSectionGroup
        enabled={sign.outOfOrder}
        name="Out Of Order"
        onChangeEnabled={v => { sign.outOfOrder = v; onChange(); }} >
        <input type="text" placeholder="Reason..." onInput={(e:Event) => { sign.outOfOrderReason = (e.target as HTMLInputElement).value; onChange(); }} />
    </SettingsSectionGroup>
);

const SettingsSignFooter = ({sign, onChange}: {sign: Sign, onChange: OnChange}) => (
  <p>Footer</p>
);

function SettingsSection(section: Section, onChange: OnChange) : JSX.Element {
  if (section instanceof SectionMaterials) return SettingsSectionMaterials({ section, onChange });
  else if (section instanceof SectionFreeText) return SettingsSectionFreeText({ section, onChange });
  //else if (section instanceof SectionOutOfOrder) return SettingsSectionOutOfOrder({ section });
  else if (section instanceof SectionSafety) return SettingsSectionSafety({ section, onChange });
  else throw new Error("Unexpected section type " + typeof(section));
}

export const SettingsSign = ({ sign, onChange }: { sign: Sign, onChange: OnChange }) => {
  const sections = sign.sections;
  const arr = [
    sections.allowedMaterials,
    sections.prohibitedMaterials,
    sections.quickStart
  ];
  return (<div class="sign-root">
    <SignHeader sign={sign} onChange={onChange} />
    <SignOutOfOrder sign={sign}  onChange={onChange} />
    {arr.map(s => SettingsSection(s, onChange))}
    <SettingsSignFooter sign={sign} onChange={onChange} />
  </div>);
};

