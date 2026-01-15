-- Add Academic Years table
CREATE TABLE IF NOT EXISTS academic_years (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE academic_years ENABLE ROW LEVEL SECURITY;

-- Policies for public reading
CREATE POLICY "Academic years are readable by everyone" ON academic_years
    FOR SELECT USING (true);

-- Policies for admin management
CREATE POLICY "Admins can manage academic years" ON academic_years
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role = 'admin'
        )
    );

-- Insert some default years
INSERT INTO academic_years (name) VALUES 
('2026'), ('2025'), ('2024'), ('2023'), ('2022')
ON CONFLICT (name) DO NOTHING;
