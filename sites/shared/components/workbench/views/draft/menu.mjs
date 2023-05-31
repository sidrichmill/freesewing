import {
  DesignOptions,
  ns as designMenuNs,
} from 'shared/components/workbench/menus/design-options/index.mjs'
import {
  CoreSettings,
  ns as coreMenuNs,
} from 'shared/components/workbench/menus/core-settings/index.mjs'
import { XrayMenu, ns as xrayNs } from 'shared/components/workbench/menus/xray/index.mjs'

export const ns = [...coreMenuNs, ...designMenuNs, ...xrayNs]

export const DraftMenu = ({
  design,
  pattern,
  patternConfig,
  settings,
  ui,
  update,
  language,
  account,
  DynamicDocs,
}) => {
  // Default control level is 2 (in case people are not logged in)
  const control = account.control || 2
  const menuProps = {
    design,
    patternConfig,
    settings,
    update,
    language,
    account,
    DynamicDocs,
    control,
  }

  return (
    <nav className="grow mb-12">
      <DesignOptions {...menuProps} />
      <CoreSettings {...menuProps} />
      <XrayMenu {...menuProps} ui={ui} />
    </nav>
  )
}
