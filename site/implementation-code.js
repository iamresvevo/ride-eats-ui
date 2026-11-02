// Emit a complete controlled example, matching the live workbench state.
export function implementationCode(component, props, controlled) {
  const hasValue = Object.hasOwn(controlled, 'value');
  const data = ['options', 'rows', 'columns', 'items'].filter(key => Object.hasOwn(controlled, key));
  const attr = (key, value) => typeof value === 'string'
    ? `      ${key}=${JSON.stringify(value)}`
    : `      ${key}={${JSON.stringify(value)}}`;
  const attributes = Object.entries(props).map(([key, value]) => attr(key, value));
  for (const key of data) attributes.push(`      ${key}={${key}}`);
  if (hasValue) {
    attributes.push('      value={value}');
    attributes.push(component === 'Textarea'
      ? '      onChange={event => setValue(event.target.value)}'
      : '      onValueChange={setValue}');
  }
  for (const key of ['first', 'second']) if (key in controlled) attributes.push(attr(key, controlled[key]));
  const imports = component === 'AppShell' ? 'AppShell, Card' : component;
  const constants = data.map(key => `const ${key} = ${JSON.stringify(controlled[key], null, 2)};`).join('\n\n');
  return `${hasValue ? "import { useState } from 'react';\n" : ''}import { ${imports} } from '@ride-eats/ui';\nimport '@ride-eats/ui/styles.css';\n${constants ? '\n'+constants+'\n' : ''}\nexport default function Example() {\n${hasValue ? `  const [value, setValue] = useState(${JSON.stringify(controlled.value)});\n` : ''}  return (\n    <${component}\n${attributes.join('\n')}\n${component === 'AppShell' ? '    >\n      <Card title={value === "team" ? "Your team" : "Overview"}>Workspace content</Card>\n    </AppShell>' : '    />'}\n  );\n}`;
}
