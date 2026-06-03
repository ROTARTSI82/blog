import Mathlib.Algebra.Module.Basic
import Mathlib.Data.Real.Basic
import Mathlib.Tactic

-- proposition that all vectors (v : V) in the list are also elements of the set S.
def allin {V} (ls : List (ℝ × V)) (S : Set V) : Prop := match ls with
| List.cons ⟨_, v⟩ rest => v ∈ S ∧ allin rest S
| List.nil => True

theorem allin_concat {V} : ∀(la lb : List (ℝ × V)) (S : Set V),
    allin la S ∧ allin lb S ↔ allin (la ++ lb) S := by
  intros la lb S
  induction la with
  | nil =>
    -- ⊢ allin [] S ∧ allin lb S ↔ allin ([] ++ lb) S
    simp [allin] -- just unfold the definition of allin
  | cons head tail ih =>
    -- ih : allin tail S ∧ allin lb S ↔ allin (tail ++ lb) S
    -- ⊢ allin (head::tail) S ∧ allin lb S ↔ allin (head::tail ++ lb) S
    simp [allin]
    rw [and_assoc]
    -- ⊢ head.2 ∈ S ∧ allin tail S ∧ allin lb S ↔ head.2 ∈ S ∧ allin (tail ++ lb) S
    constructor -- construct the Iff
    · -- forward direction of Iff
      intros m -- head.2 ∈ S ∧ allin tail S ∧ allin lb S
      constructor -- And constructor
      · exact m.left -- head.2 ∈ S
      · exact ih.mp m.right -- allin (tail ++ lb) S
    · -- backward direction of Iff
      intros m -- head.2 ∈ S ∧ allin (tail ++ lb) S
      constructor -- And constructor
      · exact m.left -- head.2 ∈ S
      · exact ih.mpr m.right -- allin tail S ∧ allin lb S

/- this is not used in the "subspace closed proof" but
  i wrote it as i was trying to figure out how to do inductive proofs -/
theorem allin_ordering {V} : ∀(ls : List (ℝ × V)) (A B : Set V),
    A ⊆ B → allin ls A → allin ls B := by
  intros ls A B subset allA
  induction ls with
  | nil => simp [allin]
  | cons head rest ih =>
    simp [allin] at allA
    simp [allin]
    constructor
    · apply subset
      exact allA.left
    · apply ih
      exact allA.right

-- helper theorem because real multiplication on ℝ (*)
-- and scalar multiplication on modules (•) use different notation.
theorem real_mul_smul : ∀(a b : ℝ), a * b = a • b := by simp

namespace Vect

variable {V} [AddCommGroup V] [Module ℝ V]

def sumUp (vecs : List (ℝ × V)) : V := match vecs with
  | List.cons ⟨c, v⟩ rest => c • v + sumUp rest
  | List.nil => 0

def span (S : Set V) : Set V :=
  {x : V | ∃(C : List (ℝ×V)),
    (sumUp C = x) ∧ (allin C S) }

theorem sumup_concat : ∀(a b : List (ℝ×V)),
    sumUp (a++b) = sumUp a + sumUp b := by
  intros a b
  -- linked lists are an inductive type so we can do induction on a
  induction a with
  | nil =>
    -- base case: ⊢ sumUp ([] ++ b) = sumUp [] + sumUp b
    simp [sumUp] -- just unfold the definition of sumUp!
  | cons head tail ih =>
    -- inductive hypothesis ih : sumUp (tail ++ b) = sumUp tail + sumUp b
    -- inductive case: ⊢ sumUp (head :: tail ++ b) = sumUp (head :: tail) + sumUp b
    simp [sumUp]
    -- ⊢ head.1 • head.2 + sumUp (tail ++ b) = head.1 • head.2 + sumUp tail + sumUp b
    rw [ih]
    rw [add_assoc]

def lsmul (r : ℝ) (ls : List (ℝ × V)) : List (ℝ × V) :=
    List.map (fun ⟨a, b⟩ ↦ ⟨r • a, b⟩) ls

-- dedicated theorem just for rewriting between lsmul and its expanded definition.
-- Is there a better way?
omit [AddCommGroup V] [Module ℝ V] in
theorem lsmul_def : ∀(ls : List (ℝ×V)) (r : ℝ), lsmul r ls =
    List.map (fun ⟨a, b⟩ ↦ ⟨r * a, b⟩) ls := by simp [lsmul]

theorem sumup_lin : ∀(ls : List (ℝ×V)) (r : ℝ),
    sumUp (lsmul r ls) = r • (sumUp ls) := by
  intro ls r
  induction ls with
  | nil =>
    unfold lsmul sumUp
    simp -- empty list: sumUp [] = 0, and 0 = x • 0
  | cons head tail ih =>
    -- ih : sumUp (lsmul r tail) = r • sumUp tail
    unfold sumUp lsmul; dsimp
    -- ⊢ (r * head.1) • head.2 + sumUp (List.map (fun x ↦ (r * x.1, x.2)) tail) = r • (head.1 • head.2 + sumUp tail)
    rw [← lsmul_def, ih]
    -- ⊢ (r * head.1) • head.2 + r • sumUp tail = r • (head.1 • head.2 + sumUp tail)
    rw [smul_add, real_mul_smul, smul_assoc]

omit [AddCommGroup V] [Module ℝ V] in
theorem lsmul_allin : ∀(ls : List (ℝ×V)) (S: Set V) (r : ℝ),
    allin ls S ↔ allin (lsmul r ls) S := by
  intros ls S r
  constructor -- Iff
  · induction ls with -- forward direction of Iff
    | nil => -- ⊢ allin [] S → allin (lsmul r []) S
      unfold lsmul List.map; simp
    | cons head tail ih =>
      -- ih : allin tail S → allin (lsmul r tail) S
      -- ⊢ allin (head :: tail) S → allin (lsmul r (head :: tail)) S
      unfold allin lsmul; dsimp
      rw [← lsmul_def]
      -- ⊢ head.2 ∈ S ∧ allin tail S → head.2 ∈ S ∧ allin (lsmul r tail) S
      intro ⟨elem, rest⟩
      exact ⟨elem, ih rest⟩
  · induction ls with -- backward direction of Iff
    | nil => -- ⊢ allin (lsmul r []) S → allin [] S
      unfold lsmul List.map; simp
    | cons head tail ih =>
      -- ih : allin (lsmul r tail) S → allin tail S
      -- ⊢ allin (lsmul r (head :: tail)) S → allin (head :: tail) S
      unfold allin lsmul; dsimp
      rw [← lsmul_def]
      -- ⊢ head.2 ∈ S ∧ allin (lsmul r tail) S → head.2 ∈ S ∧ allin tail S
      intro ⟨elem, rest⟩
      exact ⟨elem, ih rest⟩

-- this is also an unused theorem.
theorem span_ordering : ∀(A B : Set V), A ⊆ B → span A ⊆ span B := by
  intro A B hypsubset
  unfold span
  simp
  intros v ls hypeq hypall
  constructor
  · constructor
    · apply hypeq
    · exact allin_ordering ls A B hypsubset hypall

theorem zero_in_span : ∀(S : Set V), 0 ∈ span S := by
  intro S
  unfold span
  let ex : List (ℝ × V) := List.nil
  dsimp
  -- ⊢ ∃ C, sumUp C = 0 ∧ allin C S
  fconstructor -- constructor for ∃
  · exact ex -- example empty list
  · -- unfold definitions to show it's a linear combo for 0
    unfold ex sumUp allin
    simp

theorem span_mul_closed : ∀(S : Set V) (r : ℝ)
    (u : {v : V // v ∈ span S}), r • u.val ∈ span S := by
  intros S r u
  unfold span; dsimp
  -- ⊢ ∃ C, sumUp C = r • ↑u ∧ allin C S

  let pu := u.prop
  unfold span at pu; dsimp at pu
  -- pu : ∃ C, sumUp C = ↑u ∧ allin C S
  --       ⟨lu, sumUp lu = ↑u ∧ allin lu S⟩
  rcases pu with ⟨lu, pu⟩
  let ex: List (ℝ × V) := lsmul r lu
  have sum_val : sumUp ex = r • u := by
    unfold ex
    -- ⊢ sumUp (lsmul r lu) = r • ↑u
    rw [sumup_lin, pu.left]
  have allin_proof : allin ex S := by
    unfold ex
    -- ⊢ allin (lsmul r lu) S
    exact (lsmul_allin lu S r).mp pu.right
  constructor -- for ∃
  · exact ⟨sum_val, allin_proof⟩

theorem span_add_closed : ∀(S : Set V) (a b : {v : V // v ∈ span S}),
    a.val + b.val ∈ span S := by
  intros S a b
  let pa := a.prop -- a ∈ span S
  let pb := b.prop -- b ∈ span S
  unfold span at pa; dsimp at pa
  unfold span at pb; dsimp at pb

  -- pa : ∃ C, sumUp C = ↑a ∧ allin C S
  --      ⟨xa, ⟨sumUp xa = ↑a, allin xa S⟩⟩
  rcases pa with ⟨xa, ⟨ha_sum, ha_sub⟩⟩
  -- pb : ∃ C, sumUp C = ↑b ∧ allin C S
  --      ⟨xb, ⟨sumUp xb = ↑b, allin xb S⟩⟩
  rcases pb with ⟨xb, ⟨hb_sum, hb_sub⟩⟩
  have sumeq: sumUp (xa ++ xb) = a.val + b.val := by
    calc
      _ = sumUp xa + sumUp xb := by exact sumup_concat xa xb
      _ = a.val + b.val := by rw [ha_sum, hb_sum]
  have ain: allin (xa ++ xb) S := by
    exact (allin_concat xa xb S).mp ⟨ha_sub, hb_sub⟩

  unfold span
  dsimp
  -- ⊢ ∃ C, sumUp C = ↑a + ↑b ∧ allin C S
  constructor
  · exact ⟨sumeq, ain⟩

-- define the zero vector on the span subspace
instance (S : Set V) : Zero {v : V // v ∈ span S} where
  zero := Subtype.mk 0 <| zero_in_span S

-- vector negation
instance (S : Set V) : Neg {v : V // v ∈ span S} where
  neg (a : {v : V // v ∈ span S}) :=
    Subtype.mk (-a.val) <| by
      have sub : -a.val = (-1 : ℝ) • a.val := by simp
      rw [sub]
      exact span_mul_closed S (-1) a

-- vector addition
instance (S : Set V) : Add {v : V // v ∈ span S} where
  add (a b : {v: V // v ∈ span S}) :=
    Subtype.mk (a.val + b.val) <| span_add_closed S a b

@[simp]
theorem subtype_ext_add : ∀(S: Set V) (a b : {v : V // v ∈ span S}),
    (a + b).val = a.val + b.val := by intros S a b; rfl

@[simp]
theorem subtype_ext_neg : ∀(S : Set V) (a : {v : V // v ∈ span S}),
  (-a).val = -(a.val) := by intros S a; rfl

@[simp]
theorem subtype_ext_zero : ∀(S : Set V),
  (0 : {v : V // v ∈ span S}).val = 0 := by intro S; rfl

-- vector addition is an abelian group
instance (S : Set V) : AddCommGroup {v: V // v ∈ span S} where
  add_assoc := by intro a b c; ext; simp; rw [add_assoc]
  zero_add := by intro z; ext; simp;
  add_zero := by intro a; ext; simp;
  add_comm := by intro a b; ext; simp; rw [add_comm]
  neg_add_cancel := by intro a; ext; simp;
  nsmul := nsmulRec
  zsmul := zsmulRec

-- scalar multiplication
instance (S : Set V) : SMul ℝ {v : V // v ∈ span S} where
  smul (r : ℝ) (u : {v : V // v ∈ span S}) :=
    Subtype.mk (r • u.val) <| span_mul_closed S r u

@[simp]
theorem subtype_ext_smul : ∀(S: Set V) (r: ℝ)
    (u : {v : V // v ∈ span S}), (r • u).val = r • u.val := by
  intros S a b; rfl

-- we have the module axioms: spans are subspaces!
instance (S : Set V) : Module ℝ {v : V // v ∈ span S} where
  one_smul := by intro b; ext; simp
  mul_smul := by intros a b c; ext; simp; rw [mul_smul]
  smul_zero := by intros a; ext; simp;
  smul_add := by intros a b c; ext; simp
  add_smul := by intros a b c; ext; simp; rw [add_smul]
  zero_smul := by intros a; ext; simp

def nallz (ls : List (ℝ × V)) : Prop := match ls with
| List.cons ⟨r, _⟩ rest => r ≠ 0 ∨ nallz rest
| List.nil => False

def linIndep (S : Set V) : Prop :=
    ¬∃(C : List (ℝ × V)), sumUp C = 0 ∧ nallz C ∧ allin C S

structure Basis (S : Set V) where
  spansFull : ∀(v: V), v ∈ span S
  indep : linIndep S

/- im convinced this is impossible
theorem dim_invariant : ∀(B₁ B₂ : Set V),
    (h₁ : Basis B₁) → (h₂ : Basis B₂) →
      ∃(f : {v : V // v ∈ B₁} → {v : V // v ∈ B₂}), Bijective f := by
  intros B₁ B₂ h₁ h₂
  let contra:
      (¬∃(f : {v : V // v ∈ B₁} → {v : V // v ∈ B₂}), Bijective f)
        → False := by
    intro hyp
    simp at hyp
    sorry
  exact Classical.byContradiction contra
-/

end Vect
