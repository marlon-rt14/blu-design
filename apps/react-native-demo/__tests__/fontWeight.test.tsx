import React from 'react';
import { Text } from 'react-native';
import ReactTestRenderer from 'react-test-renderer';

import { Alert, BluProvider, Button, ListItem, Tag, resolveFontWeight } from '@dsm/mobile';

/**
 * Mobile ships no font files: the text uses each platform's own system
 * typeface — SF Pro on iOS, Roboto on Android — which means the **weight** is
 * the only thing that selects a cut.
 *
 * That is worth a test because the failure is invisible. A style that names a
 * family which does not resolve, or that names none and sets no weight either,
 * still renders perfectly readable text — just all of it at regular. What is
 * asserted here is the pair: no `fontFamily`, and a real numeric `fontWeight`.
 */
describe('resolveFontWeight', () => {
  it('passes the token weight straight through', () => {
    for (const weight of ['400', '500', '600', '700', '800']) {
      expect(resolveFontWeight(weight)).toBe(weight);
    }
  });
});

describe('what a component actually puts in its style', () => {
  const flatten = (style: unknown): Record<string, unknown> =>
    Array.isArray(style)
      ? style.reduce<Record<string, unknown>>((acc, s) => ({ ...acc, ...flatten(s) }), {})
      : { ...(style as Record<string, unknown>) };

  it('sets a numeric weight and no family at all', async () => {
    let tree: ReactTestRenderer.ReactTestRenderer | undefined;
    await ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(
        <BluProvider>
          <Button label="Aceptar" onPress={() => undefined} />
        </BluProvider>,
      );
    });
    const style = flatten(tree!.root.findByType(Text).props.style);

    // No family: that is what hands the text to the system typeface.
    expect(style['fontFamily']).toBeUndefined();
    // And the weight has to be there, or every cut collapses to regular.
    expect(style['fontWeight']).toMatch(/^[1-9]00$/);
  });
});

describe('across components, not just one', () => {
  const flattenAll = (style: unknown): Record<string, unknown> =>
    Array.isArray(style)
      ? style.reduce<Record<string, unknown>>((acc, s) => ({ ...acc, ...flattenAll(s) }), {})
      : { ...(style as Record<string, unknown>) };

  it('never names a font family, and the weight really varies', async () => {
    let tree: ReactTestRenderer.ReactTestRenderer | undefined;
    await ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(
        <BluProvider>
          <Button label="Aceptar" onPress={() => undefined} />
          <Tag label="Verificado" />
          <Alert body="Algo pasó" title="Aviso" />
          <ListItem description="Hoy, 10:24" label="Transferencia" trailingText="$1.250" />
        </BluProvider>,
      );
    });
    const styles = tree!.root.findAllByType(Text).map((n) => flattenAll(n.props.style));

    // Guard first: an empty tree would make everything below pass vacuously,
    // which is exactly how the first version of this test fooled itself.
    expect(styles.length).toBeGreaterThan(5);

    // One family anywhere is a component that slipped past the migration — on a
    // device it would render in something else, with no error to notice.
    expect(styles.filter((s) => s['fontFamily'] !== undefined)).toEqual([]);

    // And more than one weight has to survive, or the system font is being
    // asked for a single cut and the whole ramp is flat.
    const weights = new Set(styles.map((s) => s['fontWeight']).filter(Boolean));
    expect(weights.size).toBeGreaterThan(1);
  });
});
