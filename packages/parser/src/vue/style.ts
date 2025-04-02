import postcss from 'postcss';

export type CSSRules = Record<string, Record<string, string>>;

export interface ParseStyleResult {
  styles: CSSRules;
  css: string;
}
export function parseStyle(content: string) {
  const styles: CSSRules = {};
  const css: string[] = [];
  const root = postcss.parse(content);
  const classRegex = /^.[\w]+_[\w]{5,}/;
  for (const rule of root.nodes) {
    if (rule.type === 'rule') {
      const style: Record<string, string> = {};
      if (classRegex.test(rule.selector)) {
        rule.nodes.forEach((decl) => {
          if (decl.type === 'decl') {
            style[decl.prop] = decl.value;
          }
        });
        styles[rule.selector] = style;
      } else {
        css.push(rule.toString());
      }
    }
  }
  return {
    styles,
    css: css.join('\n')
  };
}
