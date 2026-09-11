const Currency = require('@barchart/common-js/lang/Currency'),
	Day = require('@barchart/common-js/lang/Day'),
	Decimal = require('@barchart/common-js/lang/Decimal');

const InstrumentType = require('./../../lib/data/InstrumentType'),
	TransactionType = require('./../../lib/data/TransactionType');

const TransactionFormatter = require('./../../lib/formatters/TransactionFormatter');

describe('When transactions are formatted', () => {
	'use strict';

	let position;
	let transaction;

	beforeEach(() => {
		position = {
			position: 'position',
			instrument: {
				id: 'instrument',
				type: InstrumentType.EQUITY,
				currency: Currency.USD
			}
		};

		transaction = {
			position: 'position',
			transaction: 'transaction',
			sequence: 1,
			type: TransactionType.BUY,
			date: Day.parse('2026-09-10'),
			quantity: new Decimal(1),
			fee: Decimal.ZERO,
			amount: new Decimal(10),
			trade: { price: new Decimal(10) },
			snapshot: { open: new Decimal(1), basis: new Decimal(10) }
		};
	});

	it('should identify a manually created transaction', () => {
		const formatted = TransactionFormatter.format([ transaction ], [ position ]);

		expect(formatted[0].userCreated).toBe(true);
	});

	it('should identify a broker-imported transaction', () => {
		transaction.snaptrade = { instrument: 'instrument', transaction: 'broker-transaction' };

		const formatted = TransactionFormatter.format([ transaction ], [ position ]);

		expect(formatted[0].userCreated).toBe(false);
	});

	it('should identify an edited broker-imported transaction', () => {
		transaction.snaptrade = { instrument: 'instrument', transaction: 'broker-transaction', edited: true };

		const formatted = TransactionFormatter.format([ transaction ], [ position ]);

		expect(formatted[0].edited).toBe(true);
	});

	it('should identify an untouched broker-imported transaction as not edited', () => {
		transaction.snaptrade = { instrument: 'instrument', transaction: 'broker-transaction' };

		const formatted = TransactionFormatter.format([ transaction ], [ position ]);

		expect(formatted[0].edited).toBe(false);
	});

	it('should identify a manually created transaction as not edited', () => {
		const formatted = TransactionFormatter.format([ transaction ], [ position ]);

		expect(formatted[0].edited).toBe(false);
	});
});
