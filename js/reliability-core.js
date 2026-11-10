'use strict';
(() => {
  const definitions = {
    SAIDI: {
      name: 'Average outage duration',
      group: 'duration',
      unit: 'hours / customer',
      meaning: 'Total sustained outage time, averaged across all customers served.',
      formula: 'Customer interruption hours ÷ customers served',
      needed:
        'Sustained outage durations and affected customer counts, using one reporting method.',
    },
    SAIFI: {
      name: 'Average outage frequency',
      group: 'frequency',
      unit: 'interruptions / customer',
      meaning: 'How often an average customer experiences a sustained interruption.',
      formula: 'Customer interruptions ÷ customers served',
      needed: 'Sustained customer interruption counts and the customer base for the same period.',
    },
    CAIDI: {
      name: 'Average restoration time',
      group: 'duration',
      unit: 'hours / interruption',
      meaning:
        'Average duration of a customer interruption. This is not a promise about how long an individual repair will take.',
      formula: 'SAIDI ÷ SAIFI, with matching periods, populations and exclusions',
      needed:
        'A compatible SAIDI and SAIFI pair, or a separately published restoration-duration index. The result is undefined when SAIFI is zero.',
    },
    CAIFI: {
      name: 'Frequency for affected customers',
      group: 'frequency',
      unit: 'interruptions / affected customer',
      meaning: 'Average sustained interruptions among customers who lost power at least once.',
      formula: 'Customer interruptions ÷ distinct customers interrupted',
      needed:
        'The number of distinct customers interrupted. SAIFI alone cannot supply that denominator.',
    },
    MAIFI: {
      name: 'Momentary interruption frequency',
      group: 'frequency',
      unit: 'momentary interruptions / customer',
      meaning:
        'Brief interruptions experienced per customer. Publishers can use different time thresholds and counting rules.',
      formula: 'Momentary customer interruptions ÷ customers served',
      needed:
        'Momentary-event records and the publisher’s duration threshold. It cannot be inferred from sustained-outage averages.',
    },
    ASAI: {
      name: 'Service availability',
      group: 'availability',
      unit: '%',
      meaning: 'The share of requested customer-service hours in which supply was available.',
      formula: '100 × (customer-service hours − interruption hours) ÷ customer-service hours',
      needed:
        'The requested service hours, calendar period and outage scope. An adjusted availability measure is different from all-event availability.',
    },
    CEMIn: {
      name: 'Repeated interruptions',
      group: 'experience',
      unit: '% of customers',
      meaning:
        'The share of customers whose interruption count reaches a stated threshold. Read the threshold beside each figure.',
      formula: 'Customers meeting the publisher’s interruption threshold ÷ customers served × 100',
      needed:
        'Individual customer histories, a threshold n, and the exact greater-than or at-least rule. A system average cannot reveal this distribution.',
    },
    CELID: {
      name: 'Long interruptions',
      group: 'experience',
      unit: '% of customers',
      meaning:
        'The share of customers meeting a long-outage threshold. Some publishers measure one long event; others measure cumulative annual hours.',
      formula: 'Customers meeting the specified duration rule ÷ customers served × 100',
      needed:
        'Customer-level outage duration histories, the threshold and whether the rule covers a single event or cumulative time.',
    },
    ENS: {
      name: 'Energy not supplied',
      group: 'energy',
      unit: 'MWh',
      meaning:
        'Energy that could not be delivered during interruptions, using the publisher’s measured or estimated interrupted-load method.',
      formula: 'Sum of interrupted load × interruption duration',
      needed:
        'Interrupted load over time. Electricity imports, net trade and installed capacity are not substitutes for unserved energy.',
    },
    AENS: {
      name: 'Average energy not supplied',
      group: 'energy',
      unit: 'kWh / customer',
      meaning: 'Unserved energy averaged across the customer base for the same scope and period.',
      formula: 'ENS in kWh ÷ customers served',
      needed:
        'A verified ENS value and a matching customer denominator. Here AENS means average energy not supplied; publishers may use the acronym differently.',
    },
    SARI: {
      name: 'Transmission restoration time',
      group: 'duration',
      unit: 'hours',
      meaning:
        'Average interruption duration at transmission delivery points, using the filing’s restoration definition.',
      formula: 'Use the transmission publisher’s delivery-point definition',
      needed:
        'Transmission interruption and delivery-point records. This measure is separate from distribution-customer CAIDI.',
    },
    DPUI: {
      name: 'Delivery-point unavailability',
      group: 'availability',
      unit: 'system minutes',
      meaning: 'A transmission service-unavailability index reported at delivery points.',
      formula: 'Use the transmission publisher’s delivery-point definition',
      needed:
        'Transmission load and delivery-point interruption data. It is not a household service-availability percentage.',
    },
  };
  const base = (metric) =>
    /^ENS-/.test(metric)
      ? 'ENS'
      : /^CEMI(?:-|\d)/.test(metric)
        ? 'CEMIn'
        : /^CELID(?:-|\d)/.test(metric)
          ? 'CELID'
          : metric;
  const caidi = (saidi, saifi) =>
    Number.isFinite(saidi) && saidi >= 0 && Number.isFinite(saifi) && saifi > 0
      ? saidi / saifi
      : null;
  function valid(d) {
    try {
      return (
        !!d &&
        Array.isArray(d.rows) &&
        d.rows.length > 0 &&
        Array.isArray(d.coverage) &&
        d.coverage.length === 13 &&
        new Set(d.coverage.map((c) => c.region)).size === 13 &&
        Number.isFinite(Date.parse(d.reviewedAt)) &&
        d.rows.every(
          (r) =>
            typeof r.utilityId === 'string' &&
            definitions[base(r.metric)] &&
            Number.isFinite(r.value) &&
            r.value >= 0 &&
            (r.metric !== 'CAIFI' || r.value >= 1) &&
            (!['ASAI', 'CEMIn', 'CELID'].includes(base(r.metric)) || r.value <= 100) &&
            typeof r.period === 'string' &&
            typeof r.method === 'string' &&
            typeof r.scope === 'string' &&
            typeof r.unit === 'string' &&
            /^https:\/\//.test(r.sourceUrl) &&
            !new URL(r.sourceUrl).username &&
            !new URL(r.sourceUrl).password,
        )
      );
    } catch {
      return false;
    }
  }
  globalThis.EOReliabilityCore = Object.freeze({ definitions, base, caidi, valid });
})();
