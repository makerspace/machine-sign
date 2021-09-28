import { render, Component, Fragment } from 'inferno';
import { SafetyIcon, Material, Access, Sign, Section, SectionOutOfOrder, SectionSafety, SectionMaterials, SectionFreeText, SafetyItem, SectionCleanup, CleanupItem, PaperSize } from './data';
import { safetyIcon2name, iconDelete, ColorClass } from './view_common';

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

const SettingsMaterialItem = ({material, onChange, onDelete} : {material: Material, onChange: OnChange, onDelete: ()=>void}) => {
    return (
        <div class="selection-row">
            <input type="text" list="autocomplete-material" placeholder="Material name" value={material.label} onInput={(e: Event) => { material.label = (e.target as HTMLInputElement).value; onChange(); }} />
            <button onClick={ onDelete } tabIndex={-1}><img class="invert" src={iconDelete} /></button>
        </div>
    );
};

const SettingsSectionMaterials = ({section, onChange}: {section: SectionMaterials, onChange: OnChange}) => (
    <SettingsSectionGroup name={section.defaultHeader()} enabled={section.enabled} onChangeEnabled={v => { section.enabled = v; onChange(); }} >
        { section.materials.map(v => SettingsMaterialItem({material: v, onChange, onDelete: () => { removeFromArray(section.materials, v); onChange(); }})) }
        <button onClick={ () => { section.materials.push( { label: "" }); onChange(); }}>Add material</button>
    </SettingsSectionGroup>
);

const SettingsSectionFreeText = ({section, onChange}: {section: SectionFreeText, onChange: OnChange}) => {
  return (<SettingsSectionGroup
    enabled={section.enabled}
    name={ section.header() }
    onChangeEnabled={v => { section.enabled = v; onChange(); }} >
    <textarea placeholder="Contents..." value={section.contents} onInput={(e: Event) => { section.contents = (e.target as HTMLInputElement).value; onChange(); }} />
  </SettingsSectionGroup>);
}

const SettingsSafetyItem = ({item, onChange, onDelete} : {item: SafetyItem, onChange: OnChange, onDelete: ()=>void }) => {
    const safetyIcons = Object.keys(SafetyIcon).map((k: any) => SafetyIcon[k] as any).filter(k => typeof k === "number") as number[];

    return (
        <div class="selection-row">
            <select value={item.icon} onInput={ (e: Event) => { item.icon = Number((e.target as HTMLSelectElement).value) as SafetyIcon; onChange(); }}>
                { safetyIcons.map(v => (<option value={v}>{safetyIcon2name[v]}</option>))  }
            </select>
            <input type="text" placeholder={safetyIcon2name[item.icon]} value={item.label} onInput={(e: Event) => { item.label = (e.target as HTMLInputElement).value; onChange(); }} />
            <button onClick={ onDelete } tabIndex={-1}><img class="invert" src={iconDelete} /></button>
        </div>
    );
};

function removeFromArray<T>(arr: Array<T>, item: T) {
    const i = arr.indexOf(item);
    if (i != -1) arr.splice(i, 1);
}

const SettingsSectionSafety = ({section, onChange}: {section: SectionSafety, onChange: OnChange}) => (
    <SettingsSectionGroup name={section.defaultHeader()} enabled={section.enabled} onChangeEnabled={v => { section.enabled = v; onChange(); }} >
        { section.icons.map(item => SettingsSafetyItem({item, onChange, onDelete: () => { removeFromArray(section.icons, item); onChange(); }})) }
        <button onClick={ () => { section.icons.push({ icon: SafetyIcon.SafetyGlasses, label: "" }); onChange(); }}>Add safety icon</button>
    </SettingsSectionGroup>
);

const SettingsCleanupItem = ({item, onChange, onDelete} : {item: CleanupItem, onChange: OnChange, onDelete: ()=>void}) => (
    <div class="selection-row">
        <input type="text" list="autocomplete-cleanup" placeholder="Cleanup task" value={item.label} onInput={(e: Event) => { item.label = (e.target as HTMLInputElement).value; onChange(); }} />
        <button onClick={ onDelete } tabIndex={-1}><img class="invert" src={iconDelete} /></button>
    </div>
);

const SettingsSectionCleanup = ({section, onChange}: {section: SectionCleanup, onChange: OnChange}) => (
    <SettingsSectionGroup name={section.defaultHeader()} enabled={section.enabled} onChangeEnabled={v => { section.enabled = v; onChange(); }} >
        { section.items.map(item => SettingsCleanupItem({item, onChange, onDelete: () => { removeFromArray(section.items, item); onChange(); }})) }
        <button onClick={ () => { section.items.push({ label: "" }); onChange(); }}>Add cleanup item</button>
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
    <input type="text" placeholder="Machine name" value={sign.name} onInput={(e:Event) => { sign.name = (e.target as HTMLInputElement).value; onChange(); }} />
    <input type="text" placeholder="Machine model" value={sign.model} onInput={(e:Event) => { sign.model = (e.target as HTMLInputElement).value; onChange(); }} />
    <select value={sign.access} onInput={ (e: Event) => { sign.access = Number((e.target as HTMLSelectElement).value) as Access; onChange(); }}>
        { accessLevels.map(v => (<option value={v}>{accessMessage[v]}</option>))  }
    </select>
    <input type="text" placeholder="Course URL" value={sign.courseURL} onInput={(e:Event) => { sign.courseURL = (e.target as HTMLInputElement).value; onChange(); }} />
  </SettingsSectionGroup>);
}


const SignOutOfOrder = ({sign, onChange}: {sign: Sign, onChange: OnChange}) => (
    <SettingsSectionGroup
        enabled={sign.outOfOrder}
        name="Out Of Order"
        onChangeEnabled={v => { sign.outOfOrder = v; onChange(); }} >
        <input type="text" placeholder="Reason..." value={sign.outOfOrderReason} onInput={(e:Event) => { sign.outOfOrderReason = (e.target as HTMLInputElement).value; onChange(); }} />
    </SettingsSectionGroup>
);

function setSlackChannel(sign: Sign, channel: string) {
    sign.slackChannel = channel.replace(/#/g, "");
}

function setWikiURL(sign: Sign, url: string) {
    sign.wikiURL = url.trim();
}

const SettingsSignMeta = ({sign, onChange}: {sign: Sign, onChange: OnChange}) => {
    const paperSizes = Object.keys(PaperSize).map((k: any) => PaperSize[k] as any).filter(k => typeof k === "number") as number[];
    return (<SettingsSectionGroup name="Sign">
        <select value={sign.paperSize} onInput={ (e: Event) => { sign.paperSize = Number((e.target as HTMLSelectElement).value) as PaperSize; onChange(); }}>
        { paperSizes.map(v => (<option value={v}>{PaperSize[v]}</option>))  }
    </select>
  </SettingsSectionGroup>);
};

const SettingsSignFooter = ({sign, onChange}: {sign: Sign, onChange: OnChange}) => {
    return (<SettingsSectionGroup name="Footer">
        <input type="text" placeholder="Wiki URL" value={sign.wikiURL} onInput={(e:Event) => { setWikiURL(sign, (e.target as HTMLInputElement).value); onChange(); }} />
        <input type="text" placeholder="Slack Channel" value={sign.slackChannel} onInput={(e:Event) => { setSlackChannel(sign, (e.target as HTMLInputElement).value); onChange(); }} />
  </SettingsSectionGroup>);
};

function SettingsSection(section: Section, onChange: OnChange) : JSX.Element {
  if (section instanceof SectionMaterials) return SettingsSectionMaterials({ section, onChange });
  else if (section instanceof SectionFreeText) return SettingsSectionFreeText({ section, onChange });
  //else if (section instanceof SectionOutOfOrder) return SettingsSectionOutOfOrder({ section });
  else if (section instanceof SectionSafety) return SettingsSectionSafety({ section, onChange });
  else if (section instanceof SectionCleanup) return SettingsSectionCleanup( { section, onChange });
  else throw new Error("Unexpected section type " + typeof(section));
}

function SettingsSave({ onSave, onDelete, autosaved }: { onSave: ()=>void, onDelete: ()=>void, autosaved: boolean }) {
    return (
        <SettingsSectionGroup
            enabled={true}
            name="Save"
            onChangeEnabled={null} >
            <button onClick={onDelete}>Delete</button>
            <button onClick={onSave}>{ autosaved ? "Autosaved" : "Save" }</button>
        </SettingsSectionGroup>
    )
}

export const SettingsSign = ({ sign, onChange, onSave, onDelete, autosaved }: { sign: Sign, onChange: OnChange, onSave: ()=>void, onDelete: ()=>void, autosaved: boolean }) => {
  const sections = sign.sections;
  const arr = [
    sections.allowedMaterials,
    sections.prohibitedMaterials,
    sections.quickStart,
    sections.safety,
    sections.cleanup
  ];
  return (<Fragment>
    <SignHeader sign={sign} onChange={onChange} />
    <SettingsSignMeta sign={sign} onChange={onChange} />
    <SignOutOfOrder sign={sign}  onChange={onChange} />
    {arr.map(s => SettingsSection(s, onChange))}
    <SettingsSignFooter sign={sign} onChange={onChange} />
    <SettingsSave onSave={onSave} onDelete={onDelete} autosaved={autosaved} />
    </Fragment>);
};

