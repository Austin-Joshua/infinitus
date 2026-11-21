import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { MATH_DOMAINS, buildKnowledgeGraph } from '../lib/knowledgeGraph.js';
import { EVENTS } from '../lib/data.js';

describe('Mathematical Knowledge Graph (Feature 1C)', () => {
  it('defines 6 foundational mathematical domains with valid attributes', () => {
    assert.equal(MATH_DOMAINS.length, 6);
    for (const d of MATH_DOMAINS) {
      assert.ok(d.id, 'Domain must have an ID');
      assert.ok(d.name, 'Domain must have a full name');
      assert.ok(d.shortName, 'Domain must have a short name');
      assert.ok(d.symbol, 'Domain must have a math symbol');
      assert.ok(d.color, 'Domain must have a dark mode color');
      assert.ok(d.colorLight, 'Domain must have a light mode color');
      assert.ok(d.description, 'Domain must have a description');
    }
  });

  it('builds a connected graph topology for all 44 bundled events', () => {
    const { nodes, links, nodeIndex } = buildKnowledgeGraph(EVENTS, 1000, 700);

    // 6 domain hubs + 44 events = 50 total nodes
    assert.equal(nodes.length, 50, 'Graph must contain exactly 50 nodes (6 domains + 44 events)');

    const domainNodes = nodes.filter((n) => n.type === 'domain');
    const eventNodes = nodes.filter((n) => n.type === 'event');

    assert.equal(domainNodes.length, 6, 'Must have 6 domain hub nodes');
    assert.equal(eventNodes.length, 44, 'Must have 44 event nodes');

    // Verify all nodes exist in index
    for (const node of nodes) {
      assert.ok(nodeIndex.has(node.id), `Node ${node.id} must be indexed`);
      assert.ok(typeof node.x === 'number' && !isNaN(node.x), `Node ${node.id} x coordinate must be numeric`);
      assert.ok(typeof node.y === 'number' && !isNaN(node.y), `Node ${node.id} y coordinate must be numeric`);
    }

    // Verify links: every event is connected to at least one domain
    assert.ok(links.length >= 44 + 6, 'Links must connect all events plus domain symmetry ring');
    for (const link of links) {
      assert.ok(link.source && link.target, 'Link must have source and target');
      assert.ok(typeof link.distance === 'number', 'Link must have distance');
      assert.ok(typeof link.strength === 'number', 'Link must have spring strength');
    }
  });
});
